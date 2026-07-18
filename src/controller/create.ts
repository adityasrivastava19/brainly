import type { Request, Response } from 'express';
import type { Types } from 'mongoose';
import { contentSchema } from '../validation/cotent.js';
import tag from '../model/tag.js';
import content from '../model/content.js';
export async function createcontent(req: Request, res: Response) {
    try {
        // zod validation 
        const result = contentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(401).json({ message: result.error.issues })
        }
        const { title, link, type, tag: tags } = result.data;
        //bring out the user id from the auth middleware
        const userId = (req.user as { _id?: string })?._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        //checing the tag is i database or not .. if not cretae the tag 
        const tagIds: Types.ObjectId[] = [];
        for (const tagname of tags ?? []) {
            // searching in database 
            let existingtag = await tag.findOne({ title: tagname });
            if (existingtag) {
                tagIds.push(existingtag._id);
                continue;
            }
            const newtag = await tag.create({ title: tagname });
            tagIds.push(newtag._id);
        }
        const newcontent = await content.create({
            title,
            link,
            type,
            userid: userId,
            tagref: tagIds
        })

        const populatedContent = await newcontent.populate('tagref');

        return res.status(201).json({ message: "content created successfully", content: populatedContent })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" })
    }
}
// V
// alidate the request using your Zod schema.
// Extract:
// title
// link
// type
// tag (array of strings)
// For each tag:
// Check if it already exists in the Tag collection.
// If it doesn't exist, create it.
// Store its _id.
// Create a Content document with:
// title
// link
// type
// userId (from auth middleware)
// tags (array of ObjectIds)
// Return:
// 201 Created on success.
// Appropriate error responses on validation or database failure.
// Task 2: Get User Content

// Implement:

// GET /api/v1/content

// Requirements:

// Return only the logged-in user's content.
// Populate the tags field.
// Sort by newest first.
// Task 3: Delete Content

// Implement:

// DELETE /api/v1/content/:id

// Requirements:

// Verify the content belongs to the logged-in user.
// Delete it.
// Return a success message.