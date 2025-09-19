import { readFileSync } from "node:fs";

export const sendFile = async (req, res, type) => {
    const path = `.${req.url}`;
    const extension = path.split(".").pop();

    try {
        const data = readFileSync(path);

        res.writeHead(200, {
            "Content-Type": `${type}/${extension}`,
        }).end(data);
    } catch (err) {
        if (err.code === "ENOENT") {
            res.writeHead(404).end("File not found");
        } else {
            res.writeHead(500).end("File read error");
        }
    }
};
