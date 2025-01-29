import express from "express";
import { appConfig } from "./config/index.js";
const app=express();

//start server
app.listen(appConfig.PORT, () =>{
    console.log(`Server is running on port ${appConfig.PORT}`);
})