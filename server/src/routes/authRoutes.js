import express from 'express';
import { SignUp, Login,Logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', Login);
router.post('/logout', Logout);

export default router;