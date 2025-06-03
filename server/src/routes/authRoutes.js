import express from 'express';
import { SignUp, Login, Logout, GoogleOAuth, isAuthenticated } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', Login);
router.post('/logout', Logout);
router.get('/google', GoogleOAuth)
router.get('/authenticate',verifyToken,isAuthenticated);
export default router;