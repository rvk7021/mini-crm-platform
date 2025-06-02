import express from 'express'
import { createCampaign, getCampaignList, getSegmentList } from '../controllers/campaignController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(verifyToken);
router.get('/campaign/segment', getSegmentList);
router.post('/campaign/create', createCampaign);
router.get('/campaign/list', getCampaignList);
export default router;