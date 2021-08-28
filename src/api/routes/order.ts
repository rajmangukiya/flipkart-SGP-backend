import express from 'express';
import { upload } from '../../utils/multer';
import { filteredOrders, getOrders, importOrders } from '../controllers/order';

export const orderRouter = express.Router();

 orderRouter.post('/import-order', upload.any(), importOrders.controller);

 orderRouter.get('/get-order', getOrders.controller);

 orderRouter.get('/filtered-orders', filteredOrders.validator, filteredOrders.controller);