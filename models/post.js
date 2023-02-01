let mongoose = require("mongoose");
let schema = mongoose.Schema
let ObjectId = schema.ObjectId

let postschema = new schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true },
    user: { type:ObjectId, ref: 'user' }
}, { timestamps: true })

let post = mongoose.model("post", postschema)

module.exports = post