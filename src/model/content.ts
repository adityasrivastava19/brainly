import mongoose from "mongoose";
import { required } from "zod/mini";
const contenttype=["text","image","video"]
const content=new mongoose.Schema({
    tittle:{
        type:String,
        required:true
    },
    link :{
        type:String,
        required:true
    },
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    },
    tagref:{
        type:mongoose.Schema.ObjectId,
        ref:"tag",
        required:true
    },
    type:{
        type:String,
        enum:contenttype,
        required:true
        
    }
})
export default mongoose.model("content",content)