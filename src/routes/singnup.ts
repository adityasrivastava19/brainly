import {Router} from 'express';
import { signup } from '../controller/singup.js';
const router = Router();
router.post('/signup',signup);
export default router;