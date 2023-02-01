let express=require('express')
let server=express()
let connectiontodatabase=require("./connection/conn");
let register = require('./routes/register')
let login = require('./routes/login')
const posts= require("./routes/post")



//connection with database
connectiontodatabase();



//2.Route
server.use('/register',register)
server.use('/login',login)
server.use('/posts',posts)




server.get("/",(req,res)=>{
    res.status(200).send("ok")
})



server.listen(3000,()=>{console.log("server is up at 3000")
})