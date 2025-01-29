import mongoose from 'mongoose';
import { appConfig } from './config/index.js';

const uri=appConfig.DB.MONGODB_URI;

const connectDB=async() =>{
    try{
        await mongoose.connect(uri);
        console.log("MongoDB connected")
    }catch(error){
        console.error(error.message)
    }
}

export default connectDB;