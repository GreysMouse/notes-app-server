export const noteSchema = {
    id: {
        type: Number,
        writable: false,
        validator: (value) => {
            return typeof value === "number";
        },
    },
    title: {
        type: String,
        writable: true,
        validator: (value) => {
            return typeof value === "string";
        },
    },
    text: {
        type: String,
        writable: true,
        validator: (value) => {
            return typeof value === "string";
        },
    },
    image: {
        type: [String, null],
        writable: true,
        validator: (value) => {
            return value === null || typeof value === "string";
        },
    },
    date: {
        type: Date,
        writable: false,
        validator: (value) => {
            return !isNaN(new Date(value).getDate());
        },
    },
};
