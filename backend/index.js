let express = require("express");
let mongoose = require("mongoose");
let dotenv = require("dotenv");
const connectDB = require("./config/dbConnect");
const problemRoutes = require("./routes/problemRoutes");
const judgeRoutes = require("./routes/judgeRoutes");
const auth = require("./routes/auth");
const cors = require('cors');

dotenv.config();

let app = express();


app.use(cors());
app.use(express.json());
app.use("/problems",problemRoutes)
app.use("/judge",judgeRoutes)
app.use("/user",auth)
connectDB();

app.listen(process.env.PORT,()=>{
    console.log("Server is running.");
})