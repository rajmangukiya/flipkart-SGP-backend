import fs from 'fs'
import { getRepository } from 'typeorm';
import Order from '../api/entity/Order';

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

export {
  deleteFile,
  addOrders
}