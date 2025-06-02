import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { promptSegment, saveSegment, getAllSegments, deleteSegment, getSingleSegment } from '../controllers/segmentController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/segment/list', promptSegment);
router.post('/segment/add', saveSegment);
router.get('/segment/list', getAllSegments);
router.delete('/segment/:id', deleteSegment);
router.get('/segment/:segmentId', getSingleSegment)

export default router;