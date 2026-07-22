import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validation/validate.js";
import bcrypt from "bcrypt";
import user from "../model/user.js";
import dotenv from "dotenv";
dotenv.config();

export async function signup(req: Request, res: Response) {
    try {
        // zod validation 
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.error.issues });
        }
        const { username, password } = result.data;
        
        // finding the user in the database 
        const existinguser = await user.findOne({ username });
        if (existinguser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // hashing the password
        const hashed = await bcrypt.hash(password, 10);
        
        // creating user
        const User = await user.create({
            username: username,
            password: hashed
        });

        const secret = process.env.jwt_secret ?? process.env.jwt_secert ?? "default_secret";
        
        // creating the jwt token
        const token = jwt.sign({ userid: User._id }, secret, { expiresIn: "7d" });
        return res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}