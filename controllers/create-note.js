import busboy from "busboy-esm";
import { createWriteStream } from "node:fs";
import { PassThrough } from "node:stream";
import { commitDB, database } from "../db.js";
import { noteSchema } from "../schemas.js";
import { SERVER_ORIGIN, STATIC_FILES_PATH } from "../config.js";

export const createNote = (req, res) => {
    let bb;

    try {
        bb = busboy({ headers: req.headers });
    } catch (error) {
        res.writeHead(400).end(error.message);
        return;
    }

    const entries = {};
    const note = {};
    const uid = database.uid + 1;

    bb.on("error", (error) => {
        const { statusCode = 500, errorMsg = "" } = error;

        Object.values(entries)
            .filter((entry) => entry.file)
            .forEach((file) => {
                file.stream.resume();
            });

        if (statusCode === 500 && !errorMsg) {
            console.error(errorMsg);
        }
        res.writeHead(statusCode).end(errorMsg);
    });

    bb.on("field", (key, value, info) => {
        entries[key] = { payload: value, info, file: false };
    });

    bb.on("file", (key, stream, info) => {
        const passThroughStream = new PassThrough();

        passThroughStream.on("error", (error) => {
            bb.emit("error", error);
            return;
        });

        stream.pipe(passThroughStream);
        entries[key] = { payload: passThroughStream, info, file: true };
    });

    bb.on("finish", () => {
        for (let key in noteSchema) {
            if (!noteSchema[key].writable) {
                continue;
            }
            if (!entries[key]) {
                bb.emit("error", {
                    statusCode: 400,
                    errorMsg: `Missed required field: ${key}`,
                });
                return;
            }
            if (!noteSchema[key].validator(entries[key].payload)) {
                bb.emit("error", {
                    statusCode: 400,
                    errorMsg: `Validation failed for field: ${key}`,
                });
                return;
            }
            if (noteSchema[key].file) {
                if (!entries[key].file) {
                    bb.emit("error", {
                        statusCode: 400,
                        errorMsg: `Field is not File or Blob: ${key}`,
                    });
                    return;
                }

                const newFileName = Date.now();
                const newFileExt =
                    entries[key].info?.filename?.split(".")?.slice(-1) || "";
                const newFilePath = `${STATIC_FILES_PATH}/${newFileName}.${newFileExt}`;

                const writeStream = createWriteStream(`.${newFilePath}`);

                writeStream.on("error", (error) => {
                    bb.emit("error", error);
                    return;
                });

                entries[key].payload.pipe(writeStream);
                note[key] = `${SERVER_ORIGIN}${newFilePath}`;
            } else {
                if (entries[key].file) {
                    bb.emit("error", {
                        statusCode: 400,
                        errorMsg: `Field is not String: ${key}`,
                    });
                    return;
                }

                note[key] = entries[key].payload;
            }
        }

        note.id = uid;
        note.date = new Date();

        commitDB((database) => {
            database.changed = true;
            database.uid = uid;
            database.indexes[uid] = database.notes.length;
            database.notes.push(note);
        });

        res.writeHead(200).end(JSON.stringify(note));
    });

    req.pipe(bb);
};
