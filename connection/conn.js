let mongoose=require("mongoose")
mongoose.set('strictQuery', false);
async function main(){
await mongoose.connect('mongodb://localhost:27017/git2db');
}

module.exports= main