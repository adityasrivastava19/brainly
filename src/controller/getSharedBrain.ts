import type { Request, Response } from "express";
import linkSchema from "../model/link.js";
import userSchema from "../model/user.js";
import contentSchema from "../model/content.js";

export async function getSharedBrain(req: Request, res: Response) {
    try {
        const { shareLink } = req.params;

        if (!shareLink) {
            return res.status(400).json({ message: "Share link hash is required" });
        }

        // Find link document with matching hash and isshare === true
        const link = await linkSchema.findOne({ hash: shareLink, isshare: true });
        if (!link) {
            return res.status(404).json({ message: "Shared link is invalid or disabled" });
        }

        // Find user associated with the link
        const user = await userSchema.findById(link.userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch all content items created by this user
        const content = await contentSchema.find({ userid: link.userid }).populate('tagref');

        return res.status(200).json({
            username: user.username,
            content: content
        });

    } catch (error) {
        console.error("Error retrieving shared brain:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
