import { celebrate } from "celebrate";
import Joi from "joi";
import { bcryptPassword, comparePassword } from "../../utils/bcrypt";
import httpStatus from "http-status";
import { apiResponse } from "../../utils/api-response";
import { getToken } from "../../utils/jwt";
import { getRepository } from "typeorm";
import User from "../entity/User"
import { Request, Response } from "express";
import XLSX from "xlsx";
import { addOrders, deleteFile } from "../../utils";
import Order from "../entity/Order";

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
      const orders = await orderRepo.find();
      
      return apiResponse(
        res,
        httpStatus.OK,
        orders,
        "Orders found successfully",
        null
      )

    } catch (error) {
      return apiResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "Error",
        "Tourcourses not added." + error
      )
    }
  }
}

export {
  importOrders,
  getOrders
}