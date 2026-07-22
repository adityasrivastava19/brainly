import linkSchema from "../model/link.js";
import type { Request, Response } from "express";
import crypto from "crypto";

// extract the user id from the request object
// create a token using crypto 
// then save it
export async function ShareLink(req: Request, res: Response) {
    try {
        // user id is extracted from the request object
        const userId = (req.user as { userid?: string })?.userid;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // find the existing link for the user in the database
        const existingLink = await linkSchema.findOne({ userid: userId });
        if (existingLink) {
            existingLink.isshare = true;
            await existingLink.save();
            return res.status(200).json({ message: "link generated", link: `http://localhost:3000/${existingLink.hash}` });
        }

        // if no existing link is found, create a new link
        const hash = crypto.randomBytes(20).toString("hex");
        const newLink = new linkSchema({
            hash: hash,
            userid: userId,
            isshare: true
        });
        await newLink.save();

        return res.status(200).json({ message: "link generated", link: `http://localhost:3000/${newLink.hash}` });

    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
}