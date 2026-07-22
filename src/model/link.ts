import mongoose from "mongoose";
const linkSchema=new mongoose.Schema({
    hash:{
        type:String,
        required:true
    },
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    isshare:{
        type:Boolean,
        default:false
    }
})
export default mongoose.model("Link",linkSchema)