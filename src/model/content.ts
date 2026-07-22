import mongoose from "mongoose";
const contenttype=["document", "tweet", "youtube", "link"]
const content=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    link :{
        type:String,
        required:true
    },
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    tagref:[{
        type:mongoose.Schema.ObjectId,
        ref:"Tag",
        required:true
    }],
    type:{
        type:String,
        enum:contenttype,
        required:true
        
    }
})
export default mongoose.model("Content",content)