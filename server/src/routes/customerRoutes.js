import express from 'express'
import { addUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
console.log("hue")
router.post('/user/list',addUser);

export default router;