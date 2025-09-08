import { commitDB, database } from "./db.js";
import { noteSchema } from "./schemas.js";

export const getNotes = async (req, res) => {
    res.writeHead(200).end(JSON.stringify(database.notes));
};

export const createNote = async (req, res) => {
    const chunks = [];

    req.on("error", (err) => {
        res.writeHead(500).end(JSON.stringify(err));
    })
        .on("data", (chunk) => {
            chunks.push(chunk);
        })
        .on("end", () => {
            const body = Buffer.concat(chunks).toString();
            const bodyEntries = Object.entries(JSON.parse(body));
            const schemaEntries = Object.entries(noteSchema);

            const writableValues = schemaEntries.filter(
                ([_key, value]) => !!value.writable
            );

            const isBodyValid =
                bodyEntries.length === writableValues.length &&
                bodyEntries.every(
                    ([key, value]) => !!noteSchema[key]?.validator(value)
                );

            if (!isBodyValid) {
                res.writeHead(400).end();
                return;
            }

            const uid = database.uid + 1;
            const note = {
                ...JSON.parse(body),
                id: uid,
                date: new Date(),
            };

            commitDB((database) => {
                database.changed = true;
                database.uid = uid;
                database.indexes[uid] = database.notes.length;
                database.notes.push(note);
            });

            res.writeHead(200).end(JSON.stringify(database.notes));
        });
};

export const updateNote = async (req, res) => {
    const id = req.url.split("/")[2];
    const idx = database.indexes[id];

    if (idx === undefined) {
        res.writeHead(404).end();
    } else {
        const chunks = [];

        req.on("error", (err) => {
            res.writeHead(500).end(JSON.stringify(err));
        })
            .on("data", (chunk) => {
                chunks.push(chunk);
            })
            .on("end", () => {
                const body = Buffer.concat(chunks).toString();
                const bodyEntries = Object.entries(JSON.parse(body));

                const isBodyValid = bodyEntries.every(
                    ([key, value]) =>
                        !!noteSchema[key]?.writable &&
                        noteSchema[key].validator(value)
                );

                if (!isBodyValid) {
                    res.writeHead(400).end();
                    return;
                }

                commitDB((database) => {
                    database.changed = true;
                    database.notes[idx] = {
                        ...database.notes[idx],
                        ...JSON.parse(body),
                    };
                });

                res.writeHead(200).end(JSON.stringify(database.notes[idx]));
            });
    }
};

export const deleteNote = async (req, res) => {
    const id = req.url.split("/")[2];
    const idx = database.indexes[id];

    if (idx === undefined) {
        res.writeHead(404).end();
    } else {
        const note = database.notes[idx];

        commitDB((database) => {
            database.changed = true;
            database.notes.splice(idx, 1);
            delete database.indexes[id];
        });

        res.writeHead(200).end(JSON.stringify(note));
    }
};
