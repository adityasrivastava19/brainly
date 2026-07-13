import mongoose from "mongoose";
const link=new mongoose.Schema({
    hash:{
        type:String,
        required:true
    },
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    }
})