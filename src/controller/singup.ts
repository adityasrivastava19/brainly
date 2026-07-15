import type{ Request,Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validation/validate.js";
import bcrypt from "bcrypt";
import user from "../model/user.js";
import dotenv from "dotenv";
dotenv.config();
export async function  signup(req:Request,res:Response)
{   try{
    //zod validation 
    const result=loginSchema.safeParse(req.body);
    if(!result.success)
    {
        return res.status(401).json({message:result.error.issues});
    }
    const {username,password}=result.data;
    //finding the user in the data base 
    const existinguser=await  user.findOne({username});
    if(existinguser)
    {
        return res.status(409).json({message:"username is already exist"});
    }
    //hashing the password
    const hashed=await bcrypt.hash(password,10);
    //creating user
    const User=await user.create({
        username:username,
        password:hashed
    })
    // creating the jwt token
    const token=jwt.sign({userid:User._id},process.env.jwt_secert!,{expiresIn:"7d"})
    return res.status(200).json({message:"user create",token});
}
 catch(error)
 {

 }
}