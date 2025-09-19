import { SERVER_ORIGIN } from "../config.js";
import { database } from "../db.js";
import { noteSchema } from "../schemas.js";

export const getNotes = (req, res) => {
    const url = new URL(req.url, SERVER_ORIGIN);
    const params = url.searchParams;

    let filteredNotes = database.notes;

    const search = params.get("search")?.toLowerCase();
    const page = parseInt(params.get("page"), 10);
    const limit = parseInt(params.get("limit"), 10);

    if (search) {
        const searchableKeys = Object.keys(noteSchema).filter(
            (key) => noteSchema[key].searchable
        );

        filteredNotes = filteredNotes.filter((item) => {
            return searchableKeys.some((key) =>
                item[key].toLowerCase().includes(search)
            );
        });
    }

    const totalNotes = filteredNotes.length;

    if (page) {
        const pageSize = limit > 0 ? limit : 30;

        filteredNotes = filteredNotes.slice(
            (page - 1) * pageSize,
            page * pageSize
        );
    }

    res.writeHead(200).end(
        JSON.stringify({ notes: filteredNotes, total: totalNotes })
    );
};
