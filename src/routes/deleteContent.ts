import { deleteContent } from "../controller/content.js";
import { Router } from "express";
import { auth } from "../middleware/middleware.js";
const router = Router();
router.delete("/content/:id", auth, deleteContent);
export default router;