import { celebrate } from "celebrate";
import Joi from "joi";
import { bcryptPassword, comparePassword } from "../../utils/bcrypt.js";
import { User } from "../entity/user.js";
import httpStatus from "http-status";
import { apiResponse } from "../../utils/api-response.js";
import { getToken } from "../../utils/jwt.js";

const signup = {
  validator: celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      mobile: Joi.string().length(10),
      password: Joi.string().required().min(8),
      api_key: Joi.string().required(),
    })
  }),
  controller: async (req, res) => {
    try {

      const checkUser = await User.findOne({
        where: {
          email: req.body.email
        }
      })

      if(checkUser) {
        return apiResponse(
          res,
          httpStatus.BAD_REQUEST,
          null,
          "Error",
          "User is already registered with this email"
        )
      }

      const password = await bcryptPassword(req.body.password, 10);

      const user = await User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        mobile: req.body.mobile,
        password,
        api_key: req.body.api_key,
      })

      return apiResponse(
        res,
        httpStatus.OK,
        null,
        "User registered successfully",
        null
      )
    } catch (error) {
      return apiResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "Error",
        "Error in controller: " + error
      )
    }
  }
}

const login = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    })
  }),
  controller: async (req, res) => {
    try {
      const emailCheck = await User.findOne({
        where: {
          email: req.body.email
        }
      })

      if (!emailCheck) {
        return apiResponse(
          res,
          httpStatus.NOT_FOUND,
          null,
          "Error",
          "Wrong email address"
        )
      }

      const passwordCheck = await comparePassword(req.body.password, emailCheck.password);

      if (!passwordCheck) {
        return apiResponse(
          res,
          httpStatus.BAD_REQUEST,
          null,
          "Error",
          "Wrong password"
        )
      }

      const token = getToken({ id: emailCheck.id });

      return apiResponse(
        res,
        httpStatus.OK,
        token,
        "Login Successfully",
        null
      )
    } catch (error) {
      return apiResponse(
        res,
        httpStatus.BAD_GATEWAY,
        null,
        "Error",
        "Error in controller: " + error
      )
    }
  }
}

export {
  signup,
  login
}