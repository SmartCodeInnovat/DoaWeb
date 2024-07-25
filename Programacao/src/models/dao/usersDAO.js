const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://juliadantas24:josebaruk@cluster0.5vizxvz.mongodb.net/doaweb");

connect.then(()=>{

})
.catch(()=>{
    console.log("Database connected error");
});

const LoginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
});

const collection  = new mongoose.model("users", LoginSchema);

module.exports = collection;