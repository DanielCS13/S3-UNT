import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    collection: "category",
    timestamps: true,
    versionKey: false
})

const Category = mongoose.model("Category",schema);

export default Category