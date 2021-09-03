import express from 'express';
import { upload } from '../../utils/multer';
import { filteredReturnOrders, getReturnOrders, importReturnOrders } from '../controllers/returnOrder';

export const returnorderRouter = express.Router();

returnorderRouter.post('/import-return-order', upload.any(), importReturnOrders.controller);

returnorderRouter.get('/check-return-order', getReturnOrders.controller);

returnorderRouter.get('/filtered-return-orders', filteredReturnOrders.validator, filteredReturnOrders.controller);