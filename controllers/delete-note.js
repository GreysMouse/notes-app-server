import { unlink } from "node:fs/promises";
import { commitDB, database } from "../db.js";
import { noteSchema } from "../schemas.js";
import { SERVER_ORIGIN } from "../config.js";

export const deleteNote = (req, res) => {
    const id = req.url.split("/")[2];
    const idx = database.indexes[id];

    if (idx === undefined) {
        res.writeHead(404).end("Specified id not found");
        return;
    }

    const note = database.notes[idx];

    for (let key in noteSchema) {
        if (!noteSchema[key].file) {
            continue;
        }

        const fileUrl = new URL(note[key], SERVER_ORIGIN);

        unlink(`.${fileUrl.pathname}`).catch((error) => {
            console.error(error);
        });
    }

    commitDB((database) => {
        database.changed = true;
        database.notes.splice(idx, 1);

        const indexMap = database.indexes;

        for (const key in indexMap) {
            if (indexMap[key] > idx) {
                indexMap[key] -= 1;
            }
        }
        delete indexMap[id];
    });

    res.writeHead(200).end(JSON.stringify(note));
};
