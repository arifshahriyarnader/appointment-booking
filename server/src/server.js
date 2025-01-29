import express from "express";
import bodyParser from 'body-parser';
import { appConfig } from "./config/index.js";
import connectDB from "./db.js";


const app=express();

connectDB();
app.use(bodyParser.json());

//start server
app.listen(appConfig.PORT, () =>{
    console.log(`Server is running on port ${appConfig.PORT}`);
})