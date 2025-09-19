import { createServer } from "node:http";
import { writeDB, readDB } from "./db.js";
import { getNotes } from "./controllers/get-notes.js";
import { createNote } from "./controllers/create-note.js";
import { updateNote } from "./controllers/update-note.js";
import { deleteNote } from "./controllers/delete-note.js";
import { sendFile } from "./controllers/send-file.js";

import {
    SERVER_PORT,
    SERVER_HOSTNAME,
    CORS_ALLOWED_METHODS,
    CORS_ALLOWED_HEADERS,
    CORS_ALLOWED_ORIGIN,
    DB_UPDATE_RATE_MS,
    START_MSG,
} from "./config.js";

const server = createServer((req, res) => {
    res.on("error", (error) => {
        console.error(error);
        res.writeHead(500).end();
        return;
    });

    res.setHeader("Access-Control-Allow-Origin", CORS_ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", CORS_ALLOWED_METHODS);
    res.setHeader("Access-Control-Allow-Headers", CORS_ALLOWED_HEADERS);
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
        res.writeHead(200).end();
    } else if (/^\/notes(\?.*)?$/.test(req.url) && req.method === "GET") {
        getNotes(req, res);
    } else if (req.url === "/notes" && req.method === "POST") {
        createNote(req, res);
    } else if (/^\/notes\/\d+$/.test(req.url) && req.method === "PATCH") {
        updateNote(req, res);
    } else if (/^\/notes\/\d+$/.test(req.url) && req.method === "DELETE") {
        deleteNote(req, res);
    } else if (/^\/uploads\/.+$/.test(req.url) && req.method === "GET") {
        sendFile(req, res, "image");
    } else {
        res.writeHead(400).end("Endpoint not found");
    }
});

server.listen(SERVER_PORT, SERVER_HOSTNAME, async () => {
    try {
        await writeDB(true);
        await readDB();
        setInterval(writeDB, DB_UPDATE_RATE_MS);
        console.log(START_MSG);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
