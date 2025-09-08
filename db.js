import fs from "node:fs/promises";
import { DB_PATH } from "./config.js";

export let database = {
    uid: 0,
    notes: [],
    indexes: {},
    changed: false,
};

export const commitDB = (action = () => {}) => {
    action(database);
};

export const readDB = async () => {
    const data = await fs.readFile(DB_PATH, { encoding: "utf8" });

    if (data) {
        database = JSON.parse(data);
    }
};

export const writeDB = async () => {
    if (!database.changed) return;

    try {
        await fs.writeFile(DB_PATH, JSON.stringify(database));
        database.changed = false;
    } catch (err) {
        console.error(err);
    }
};
