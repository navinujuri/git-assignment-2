let mongoose = require("mongoose");
let schema = mongoose.Schema
let ObjectId = schema.ObjectId

let userschema = new schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique:true },
        password:{type:String, required: true}
    }, { timestamps: true })

let user = mongoose.model("user", userschema)

module.exports = user