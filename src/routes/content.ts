import { Router } from 'express';
import { createcontent ,deleteContent,getAllContent} from '../controller/content.js';
import { auth } from '../middleware/middleware.js';
const router = Router();
router.post('/', auth, createcontent);
router.delete('/:id', auth, deleteContent);
router.get('/', auth, getAllContent);
export default router;
