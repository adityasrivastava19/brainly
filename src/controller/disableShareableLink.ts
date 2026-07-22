import type { Request, Response } from "express";
import linkSchema from "../model/link.js";

/*
 1. Extract the user id from the request object
 2. Find the link in the database for the user
 3. Set isshare to false
 4. Save the changes
*/ 
export async function disable(req: Request, res: Response) {
  try {
    const userId = (req.user as { userid?: string })?.userid;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const existingLink = await linkSchema.findOne({ userid: userId });
    if (!existingLink) {
      return res.status(404).json({ message: "Link not found for this user" });
    }

    existingLink.isshare = false;
    await existingLink.save();

    return res.status(200).json({ message: "Link disabled successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}