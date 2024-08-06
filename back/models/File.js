import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    idInstitution: {
        type: String,
        required: true
    },
    idUser: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
}, {
    collection: "file",
    timestamps: true,
    versionKey: false
})

const File = mongoose.model("File",schema);

export default File;