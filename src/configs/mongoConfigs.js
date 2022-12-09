const mongoose = require("mongoose");
console.log(`connectiong to ${process.env.MONGOURL}`)
mongoose.connect(process.env.MONGOURL, {}).then(()=> {
    console.log("Mongo DB Connected !!");
}).catch((err)=>{
    console.log("Error in Connecting MongoDb !!");
});
