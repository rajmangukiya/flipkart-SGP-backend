import { celebrate } from "celebrate";
import Joi from "joi";

const signup = {
  validator: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      mobile: Joi.string().length(10),
      password: Joi.string().required().min(8),
      api_key: Joi.string().required(),
    })
  }),
  controller: async (req, res) => {
    res.send(req.body);
  }
}

export {
  signup
}