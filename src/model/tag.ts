import mongoose from "mongoose";
const tag=new mongoose.Schema({
    tittle:{
        type:String
    }
})
export default mongoose.model('tag',tag)
