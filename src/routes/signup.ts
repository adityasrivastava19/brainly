import {Router} from 'express';
import { signup } from '../controller/signup.js';
const router = Router();
router.post('/signup',signup);
export default router;