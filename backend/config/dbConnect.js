const mongoose = require("mongoose");

const connectDB = async () =>{

    try{
        await mongoose.connect(process.env.DBURL);
        console.log("DB connected successfully.");
        return 0;
    }catch(err){
        console.error(err);
        process.exit(1);
    }

}

module.exports = connectDB;