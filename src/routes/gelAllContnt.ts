import { Router } from "express";
import { getAllContent } from "../controller/content.js";
import { auth } from "../middleware/middleware.js"; 
const router =Router();
router.get("/",auth,getAllContent);
export default router;