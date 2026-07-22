import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import user from "../model/user.js";
import bcrypt from 'bcrypt';
import { loginSchema } from "../validation/validate.js";
import dotenv from "dotenv";
dotenv.config();

export async function login(req: Request, res: Response) {
    try {
        // validating the zod
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.error.issues });
        }
        // taking out the username and password
        const { username, password } = result.data;
        // finding the user in database 
        const existinguser = await user.findOne({ username });
        if (!existinguser) {
            return res.status(401).json({ message: "User not found" });
        }
        const ismatch = await bcrypt.compare(password, existinguser.password);
        if (!ismatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const secret = process.env.jwt_secret ?? process.env.jwt_secert ?? "default_secret";

        // creating the jwt token 
        const token = jwt.sign({ userid: existinguser._id }, secret, { expiresIn: "7d" });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}