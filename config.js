export const SERVER_PROTOCOL = "http:";
export const SERVER_HOSTNAME = "127.0.0.1";
export const SERVER_PORT = 5000;
export const SERVER_ORIGIN = `${SERVER_PROTOCOL}//${SERVER_HOSTNAME}:${SERVER_PORT}`;

export const CORS_ALLOWED_ORIGIN = "http://127.0.0.1:10000";
export const CORS_ALLOWED_HEADERS = "Origin, Content-Type";
export const CORS_ALLOWED_METHODS = "OPTIONS, GET, POST, PATCH, DELETE";

export const MIN_FILE_SIZE_BYTES = 1;
export const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1025;
export const STATIC_FILES_PATH = "/uploads";

export const DB_PATH = "./db.json";
export const DB_UPDATE_RATE_MS = 1000;

export const START_MSG = `Server running at http://${SERVER_HOSTNAME}:${SERVER_PORT}/`;
