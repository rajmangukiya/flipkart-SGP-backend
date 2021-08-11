import { celebrate } from "celebrate";
import Joi from "joi";
import { bcryptPassword, comparePassword } from "../../utils/bcrypt.js";
import { User } from "../entity/user.js";
import httpStatus from "http-status";

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

    const password = await bcryptPassword(req.body.password, 10);

    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      mobile: req.body.mobile,
      password,
      api_key: req.body.api_key,
    })

    res.send(user);
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

    const emailCheck = await User.findOne({
      where: {
        email: req.body.email
      }
    })

    if (!emailCheck) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(new APIResponse(
          null,
          "Wrong email address",
        ));
    }

    const passwordCheck = comparePassword(req.body.password, email.password);

    if (!passwordCheck) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(
          null,
          "Wrong password",
        ));
    }

    return res
      .status(httpStatus.OK)
      .json(
        new APIResponse("Login Successfully")
      );
  }
}

export {
  signup,
  login
}