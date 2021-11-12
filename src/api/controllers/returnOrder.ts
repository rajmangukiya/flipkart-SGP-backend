import { celebrate } from "celebrate";
import Joi from "joi";
import httpStatus from "http-status";
import { apiResponse } from "../../utils/api-response";
import { getRepository } from "typeorm";
import { Request, Response } from "express";
import XLSX from "xlsx";
import { addReturnOrders, deleteFile } from "../../utils";
import ReturnOrder, { STATUS } from "../entity/ReturnOrder";
import moment from "moment";

const importReturnOrders = {
  controller: async (req: any, res: Response) => {
    try {
      if (req.files.length) {
        let ext =
          req.files[0].originalname.split(".")[
          req.files[0].originalname.split(".").length - 1
          ];

        if (ext === "xls" || ext === "xlsx" || ext === "csv") {
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
              addReturnOrders(item)
            ))
          );

          deleteFile(req.files[0].path);
          return apiResponse(
            res,
            httpStatus.OK,
            null,
            "Return Orders added",
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
        "Return orders not added" + error
      )
    }
  },
}

const checkReturnEmpty = {
  controller: async (req: Request, res: Response) => {
    try {

      const orderRepo = getRepository(ReturnOrder);
      const order = await orderRepo.findOne();

      return apiResponse(
        res,
        httpStatus.OK,
        order ? true : false,
        order ? "There are orders in database" : "There are no orders in database",
        null
      )

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

const filteredReturnOrders = {
  validator: celebrate({
    query: Joi.object().keys({
      date_option: Joi.string().default("date_option"),
      start_date: Joi.string().allow(null, ""),
      end_date: Joi.string().allow(null, ""),
      status: Joi.string().allow(null, ""),
      // order_id: Joi.string().allow(null, ""),
      per_page: Joi.number().required(),
      page_number: Joi.number().required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      const orderRepo = getRepository(ReturnOrder);

      let conditions = [];

      Object.keys(req.query).map((query) => {
        switch (query) {
          case "date_option":
            if (!req.query.start_date) break;
            if (!req.query.end_date) break;
            const start_date = moment(req.query.start_date).format('yyyy-MM-DD');
            const end_date = moment(req.query.end_date)
              .add(1, "days")
              .format('yyyy-MM-DD')

            conditions.push(
              `return_approval_date BETWEEN '${start_date}' AND '${end_date}'`
            );
            break;
          // case "order_id":
          //   if (!req.query.order_id) break;
          //   conditions.push(`order_id = '${req.query.order_id}'`);
          //   break;
          case "status":
            if (!req.query.status) break;
            if (req.query.status === "all") break;
            conditions.push(`status = '${req.query.status}'`);
            break;
        }
      });

      let query = orderRepo
        .createQueryBuilder("return_order")

      conditions.map((x, i) => {
        if (i === 0) {
          query = query.where(x);
        }
        else {
          query = query.andWhere(x);
        }
      });

      let [order, count] = await query
        .orderBy("order_id", "DESC")
        .skip((req.query.page_number - 1) * req.query.per_page)
        .take(req.query.per_page)
        .getManyAndCount();

      let result;

      result = {
        // order: order.map((x) => {
        //   return {
        //     order_id: x.order_id,
        //     status: x.status,
        //     return_approval_date: x.return_approval_date,
        //     return_requested_date: x.return_requested_date,
        //     return_id: x.return_id,
        //     tracking_id: x.tracking_id,
        //     product: x.product,
        //     return_type: x.return_type,
        //     return_sub_type: x.return_sub_type,
        //     replacement_order_item_id: x.replacement_order_item_id,
        //     return_status: x.return_status,
        //     return_delivery_promise_date: x.return_delivery_promise_date,
        //     picked_up_date: x.picked_up_date,
        //     out_for_delivery_date: x.out_for_delivery_date,
        //     completed_date: x.completed_date,
        //     total_price: x.total_price,
        //     return_reason: x.return_reason,
        //     return_sub_reason: x.return_sub_reason,
        //   };
        // }),
        order,
        total: order.map((x: any) => parseInt(x.total_price)).reduce((sum: number, value: number) => {
          return sum + value
        }, 0),
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

const changeStatus = {
  validator: celebrate({
    params: Joi.object().keys({
      return_order_id: Joi.string().required(),
    }),
  }),
  controller: async (req: Request, res: Response) => {
    try {

      const orderRepo = getRepository(ReturnOrder);
      const order = await orderRepo.findOne({
        id: req.params.return_order_id
      })

      if(!order) {
        return apiResponse(
          res,
          httpStatus.NOT_FOUND,
          null,
          null,
          "Return order not found"
        )
      }

      await orderRepo
      .createQueryBuilder()
      .update(ReturnOrder)
      .set({
        status: order.status === STATUS.MISSING ? STATUS.ARRIVED : STATUS.MISSING
      })
      .where({
        id: req.params.return_order_id
      })
      .execute()

      return apiResponse(
        res,
        httpStatus.OK,
        null,
        "return order status changed",
        null
      )

      

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

const getReturnOrder = {
  validator: celebrate({
    query: Joi.object().keys({
      orderId: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      const returnOrderRepo = getRepository(ReturnOrder);

      const returnOrder = await returnOrderRepo.findOne(req.query.orderId)

      if (returnOrder) {
        return apiResponse(
          res,
          httpStatus.OK,
          returnOrder,
          "return order found successfully",
          null
        )
      }

      throw new Error()

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
  importReturnOrders,
  checkReturnEmpty,
  filteredReturnOrders,
  changeStatus,
  getReturnOrder
}