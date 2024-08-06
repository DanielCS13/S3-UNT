import mongoose from "mongoose";

const schema = new mongoose.Schema({
    nameInstitution: {
        type: String,
        required: true
    },
    urlInstitution: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    collection: "institution",
    timestamps: true,
    versionKey: false
})

const Institution = mongoose.model("Institution",schema);

export default Institution;