import express from 'express';
import { upload } from '../../utils/multer';
import { changeStatus, checkReturnEmpty, filteredReturnOrders, getReturnOrder, importReturnOrders } from '../controllers/returnOrder';

export const returnorderRouter = express.Router();

returnorderRouter.post('/import-return-order', upload.any(), importReturnOrders.controller);

returnorderRouter.get('/check-return-order', checkReturnEmpty.controller);

returnorderRouter.get('/filtered-return-orders', filteredReturnOrders.validator, filteredReturnOrders.controller);

returnorderRouter.post('/change-status/:return_order_id', changeStatus.validator, changeStatus.controller);

returnorderRouter.get('/get-return-order', getReturnOrder.validator, getReturnOrder.controller);