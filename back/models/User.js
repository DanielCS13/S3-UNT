import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    idInstitution: {
        type: String,
        required: true
    }
}, {
    collection: "user",
    timestamps: true,
    versionKey: false
})

const User = mongoose.model("User",schema);

export default User;