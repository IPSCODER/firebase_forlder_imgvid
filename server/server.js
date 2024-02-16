import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js";
import videoRoutes from "./routes/video.js"

dotenv.config();
// express app
const app = express();
const port = process.env.PORT || 5000;


//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/videos",videoRoutes);


//listen to the requests
app.listen(port,()=>{

    //connect to db
    connectDB();
    console.log("Server started listening on port", port);

})