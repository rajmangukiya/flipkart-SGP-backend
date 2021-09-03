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
        order_id: returnOrder['Order ID'] || null,
        return_approval_date: moment(returnOrder['Return Approval Date']) || null,
        return_requested_date: moment(returnOrder['Return Requested Date']) || null,
        return_id: returnOrder['Return ID'] || null,
        tracking_id: returnOrder['Tracking ID'] || null,
        product: returnOrder['Product'] || null,
        return_type: returnOrder['Return Type'] || null,
        return_sub_type: returnOrder['Return Sub Type'] || null,
        replacement_order_item_id : returnOrder['Replacement Order Item ID'] || null,
        return_status : returnOrder['Return Status'] || null,
        return_delivery_promise_date : moment(returnOrder['Return Delivery Promise Date']) || null,
        picked_up_date: moment(returnOrder['Picked Up Date']) || null,
        out_for_delivery_date : moment(returnOrder['Out For Delivery Date']) || null,
        completed_date : moment(returnOrder['Completed Date']) || null,
        total_price : parseInt(returnOrder['Total Price']) || null,
        return_reason: returnOrder['Return Reason'] || null,
        return_sub_reason: returnOrder['Return Sub-reason'] || null,
      }

      if (!orderCheck) {
        await orderRepo.save(
          orderRepo.create(newOrder)
        )
      }
      resolve(1)
    } catch (error) {
      reject(error)
    }
  })
}

export {
  deleteFile,
  addOrders,
  addReturnOrders
}