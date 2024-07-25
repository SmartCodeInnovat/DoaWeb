const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://juliadantas24:josebaruk@cluster0.5vizxvz.mongodb.net/doaweb");

connect.then(()=>{
})
.catch(()=>{
    console.log("Database connected error");
});

const donationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    cpf:{
        type:String,
        required:true
    },
    method:{
        type: String,
        required:true
    },
    value:{
        type: String,
        required:true
    },
    date:{
        type: String,
        required:true
    },
    event:{
        type:Array,
        required:true
    }    
    }
);

const donation  = new mongoose.model("doacao", donationSchema);

module.exports = donation;