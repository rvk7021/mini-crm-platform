import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { promptSegment } from '../controllers/segmentController.js';

const router = express.Router();

// router.use(verifyToken);

router.get('/segment/list', promptSegment);

export default router;