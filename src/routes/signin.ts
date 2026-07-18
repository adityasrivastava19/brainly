import { Router } from 'express';
import { login } from '../controller/login.js';

const router = Router();

router.post('/signin', login);

export default router;
