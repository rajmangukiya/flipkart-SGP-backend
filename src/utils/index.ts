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
        order_on: order['Ordered On'],
        status: order['Order State'],
        amount: order['Invoice Amount'],
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