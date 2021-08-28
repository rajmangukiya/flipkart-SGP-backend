import { celebrate } from "celebrate";
import Joi from "joi";
import httpStatus from "http-status";
import { apiResponse } from "../../utils/api-response";
import { getRepository } from "typeorm";
import { Request, Response } from "express";
import XLSX from "xlsx";
import { addOrders, deleteFile } from "../../utils";
import Order from "../entity/Order";
import moment from "moment";

const importOrders = {
  controller: async (req: any, res: Response) => {
    try {
      if (req.files.length) {
        let ext =
          req.files[0].originalname.split(".")[
          req.files[0].originalname.split(".").length - 1
          ];

        if (ext === "xls" || ext === "xlsx") {
          const file = XLSX.readFile(req.files[0].path);

          let data = [];

          const sheets = file.SheetNames;

          for (let i = 0; i < sheets.length; i++) {
            const temp = XLSX.utils.sheet_to_json(
              file.Sheets[file.SheetNames[i]]
            );
            temp.forEach((res) => {
              data.push(res);
            });
          }

          await Promise.all(
            data.map((item) => (
              addOrders(item)
            ))
          );

          deleteFile(req.files[0].path);
          return apiResponse(
            res,
            httpStatus.OK,
            null,
            "Orders added",
            null
          )
        } else {
          deleteFile(req.files[0].path);
          return apiResponse(
            res,
            httpStatus.BAD_REQUEST,
            null,
            "Error",
            "Invalid file format"
          )
        }
      }
      return apiResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "Error",
        "There is no file"
      )
    } catch (error) {
      deleteFile(req.files[0].path);
      return apiResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "Error",
        "Orders not added." + error
      )
    }
  },
}

const getOrders = {
  controller: async (req: Request, res: Response) => {
    try {

      const orderRepo = getRepository(Order);
      const order = await orderRepo.findOne();

      if (order) {
        return apiResponse(
          res,
          httpStatus.OK,
          order ? true : false,
          order ? "There are orders in database" : "There are no orders in database",
          null
        )
      }

    } catch (error) {
      return apiResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "Error",
        "Error in controller" + error
      )
    }
  }
}

const filteredOrders = {
  validator: celebrate({
    query: Joi.object().keys({
      date_option: Joi.string().default("order_at"),
      start_date: Joi.string().allow(null, ""),
      end_date: Joi.string().allow(null, ""),
      order_id: Joi.string().allow(null, ""),
      status: Joi.string().allow(null, ""),
      per_page: Joi.number().required(),
      page_number: Joi.number().required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      const orderRepo = getRepository(Order);

      let conditions = [];

      // Object.keys(req.query).map((query) => {
      //   switch (query) {
      //     case "date_option":
      //       if (!req.query.start_date) break;
      //       if (!req.query.end_date) break;
      //       const start_date = `${req.query.start_date} 00:00:00`;
      //       const end_date = `${moment(req.query.end_date)
      //         .add(1, "days")
      //         .format('yyyy-MM-DD')
      //         .slice(0, 10)} 00:00:00`;

      //       conditions.push(
      //         `order_on BETWEEN '${start_date}' AND '${end_date}'`
      //       );
      //       break;
      //     case "order_id":
      //       if (!req.query.order_id) break;
      //       conditions.push(`order_id = '${req.query.order_id}'`);
      //       break;
      //     case "status":
      //       if (!req.query.status) break;
      //       conditions.push(`order_state = '${req.query.status}'`);
      //       break;
      //   }
      // });

      let query = orderRepo
        .createQueryBuilder("order")

      conditions.map((x, i) => {
        if (i === 0) {
          query = query.where(x);
        }
        else {
          query = query.andWhere(x);
        }
      });

      let [order, count] = await query
        // .orderBy("created_at", "DESC")
        // .skip((req.query.page_number - 1) * req.query.per_page)
        // .take(req.query.per_page)
        .getManyAndCount();

      let result;

      result = {
        order: order.map((x) => {
          return {
            order_id: x.order_id,
            shipment_id: x.shipment_id,
            order_on: x.order_on,
            hsn_code: x.hsn_code,
            order_state: x.order_state,
            product: x.product,
            invoice_no: x.invoice_no,
            invoice_date: x.invoice_date,
            selling_price: x.selling_price,
            shipping_charge: x.shipping_charge,
            tracking_id: x.tracking_id,
          };
        }),
        count,
      };

      if (result) {
        return apiResponse(
          res,
          httpStatus.OK,
          result,
          "Filtered Orders found successfully",
          null
        )
      }

    } catch (error) {
      return apiResponse(
        res,
        httpStatus.BAD_REQUEST,
        "Error",
        "Error in controller" + error,
        null
      )
    }
  },
};

export {
  importOrders,
  getOrders,
  filteredOrders
}