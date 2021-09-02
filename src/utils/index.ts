import fs from 'fs'
import moment from 'moment';
import { getRepository } from 'typeorm';
import Order from '../api/entity/Order';
import ReturnOrder from '../api/entity/ReturnOrder';

const deleteFile = (path) => {
  fs.unlink(path, function (err) {
    if (err) throw err;
  });
};

const addOrders = async (order) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderRepo = getRepository(Order);

      const orderCheck = await orderRepo.findOne({
        where: { order_id: order.order_id }
      })

      const newOrder = {
        order_id: order['Order Id'],
        shipment_id: order['Shipment ID'],
        order_on: order['Ordered On'],
        hsn_code: order['HSN CODE'],
        order_state: order['Order State'],
        product: order['Product'],
        invoice_no: order['Invoice No.'],
        invoice_date: order['Invoice Date (mm/dd/yy)'],
        invoice_amount : order['Invoice Amount'],
        selling_price : order['Selling Price Per Item'],
        shipping_charge : order['Shipping Charge per item'],
        tracking_id: order['Tracking ID'],
      }

      if (!orderCheck) {
        await orderRepo.save(
          orderRepo.create(newOrder)
        )
      }
      resolve(1)
    } catch (error) {
      reject(1)
    }
  })
}

const addReturnOrders = async (returnOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderRepo = getRepository(ReturnOrder);

      const orderCheck = await orderRepo.findOne({
        where: { order_id: returnOrder.order_id }
      })

      const newOrder = {
        order_id: returnOrder['Order ID'],
        return_approval_date: returnOrder['Return Approval Date'],
        return_requested_date: returnOrder['Return Requested Date'],
        return_id: returnOrder['Return ID'],
        tracking_id: returnOrder['Tracking ID'],
        product: returnOrder['Product'],
        return_type: returnOrder['Return Type'],
        return_sub_type: returnOrder['Return Sub Type'],
        replacement_order_item_id : returnOrder['Replacement Order Item ID'],
        return_status : returnOrder['Return Status'],
        return_delivery_promise_date : returnOrder['Return Delivery Promise Date'],
        picked_up_date: returnOrder['Picked Up Date'],
        out_for_delivery_date : returnOrder['Out For Delivery Date'],
        completed_date : returnOrder['Completed Date'],
        total_price : returnOrder['Total Price'],
        return_reason: returnOrder['Return Reason'],
        return_sub_reason: returnOrder['Return Sub-reason'],
      }

      if (!orderCheck) {
        await orderRepo.save(
          orderRepo.create(newOrder)
        )
      }
      resolve(1)
    } catch (error) {
      reject(1)
    }
  })
}

export {
  deleteFile,
  addOrders,
  addReturnOrders
}