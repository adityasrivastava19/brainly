import { Router } from 'express';
import { createcontent } from '../controller/content.js';
import { auth } from '../middleware/middleware.js';

const router = Router();

router.post('/content', auth, createcontent);

export default router;
