import express from 'express'
import { addUser, getAllCustomers, deleteCustomer, addOrderToCustomer } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.post('/customer/add', addUser);
router.get('/customer/list', getAllCustomers);
router.delete("/customer/:id", deleteCustomer);
router.post('/customer/add/order', addOrderToCustomer);

export default router;