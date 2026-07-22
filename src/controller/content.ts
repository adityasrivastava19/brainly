import type { Request, Response } from 'express';
import { mongo, type Types } from 'mongoose';
import { contentSchema } from '../validation/content.js';
import tag from '../model/tag.js';
import content from '../model/content.js';
export async function createcontent(req: Request, res: Response) {
    try {
        // zod validation 
        const result = contentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.error.issues });
        }
        const { title, link, type, tag: tags } = result.data;
        //bring out the user id from the auth middleware
        const userId = (req.user as { userid?: string })?.userid;
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
// Request
//    │
//    ▼
// Auth Middleware
//    │
//    ▼
// req.user.id
//    │
//    ▼
// Content.find({ userId })
//    │
//    ▼
// .populate("tag")
//    │
//    ▼
// Return JSON Response

 export async function deleteContent(req:Request,res:Response)
 {
            try {
                const {id}=req.params;
                const userid=(req.user as {userid ?:string })?.userid;
                if (typeof id === 'string' && !mongo.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid content id" });
                } 
                    // find the content in the datbase 
                    const deletecontent=await content.findOneAndDelete({
                        _id:id,
                        userid:userid
                    } as any)
                    if(!deletecontent)
                    {
                        return res.status(404).json({message:"content doesnot exist"});
                    }
                    return res.status(200).json({message:"content deleted successfully"});
            } catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }

 }
//                 Client
//                    │
//                    │ DELETE /api/v1/content/:id
//                    │
//                    ▼
//           Authentication Middleware
//                    │
//         Verify JWT Token
//                    │
//         Extract req.userId
//                    │
//                    ▼
//           Delete Controller
//                    │
//         Get id from req.params
//                    │
//                    ▼
//      Is ObjectId Valid?
//           │              │
//         No│              │Yes
//           ▼              ▼
//  400 Bad Request     Query MongoDB
//                      findOneAndDelete({
//                         _id: id,
//                         userId: req.userId
//                      })
//                           │
//              ┌────────────┴────────────┐
//              │                         │
//        Document Found?            Not Found
//              │                         │
//           Yes│                         │No
//              ▼                         ▼
//  Delete Document             404 Not Found
//              │
//              ▼
// 200 OK
// {
//   "message": "Content deleted successfully"
// }
export async function getAllContent(req:Request,res:Response)
{
    try {
         const userId = (req.user as {userid?:string}).userid;
         if (!userId) {
             return res.status(401).json({message: "Unauthorized"});
         }
         const allcontent = await content.find({ userid: userId }).populate('tagref');
         return res.status(200).json({ content: allcontent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

