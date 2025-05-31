import express from 'express';
import { SignUp, Login,Logout,GoogleOAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', Login);
router.post('/logout', Logout);
router.get('/google',GoogleOAuth)
export default router;