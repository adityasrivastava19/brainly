import mongoose from "mongoose";
const tag=new mongoose.Schema({
    title:{
        type:String
    }
})
export default mongoose.model('tag',tag)
