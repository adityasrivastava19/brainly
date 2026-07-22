import { Router } from "express";
import { getSharedBrain } from "../controller/getSharedBrain.js";

const router = Router();

// Public route to view shared brain content via share link hash
router.get("/:shareLink", getSharedBrain);

export default router;
