export const noteSchema = {
    id: {
        type: Number,
        file: false,
        writable: false,
        searchable: false,
        validator: (value) => {
            return typeof value === "number";
        },
    },
    title: {
        type: String,
        file: false,
        writable: true,
        searchable: true,
        validator: (value) => {
            return typeof value === "string" && value.length <= 10;
        },
    },
    text: {
        type: String,
        file: false,
        writable: true,
        searchable: true,
        validator: (value) => {
            return typeof value === "string" && value.length <= 1000;
        },
    },
    image: {
        type: [File, null],
        file: true,
        writable: true,
        searchable: false,
        validator: (value) => {
            return true;
        },
    },
    date: {
        type: Date,
        file: false,
        writable: false,
        searchable: false,
        validator: (value) => {
            return !isNaN(new Date(value).getDate());
        },
    },
};
