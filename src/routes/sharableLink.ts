import { Router } from "express";
import { auth } from "../middleware/middleware.js";
import { ShareLink } from "../controller/enableSharableLink.js";
import { disable } from "../controller/disableShareableLink.js";

const router = Router();
router.post("/",auth, ShareLink);
router.delete("/",auth, disable);

export default router;
