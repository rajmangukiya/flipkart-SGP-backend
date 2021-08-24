import jwt from "express-jwt"
import { privateKey } from "../../utils/jwt.config"
import { orderRouter } from "./order"
import { userRouter } from "./user"

export const setup = (app) => {
  app.use("/api/v1", jwt({ algorithms: ["HS256"], secret: privateKey }).unless({
    path: [
      "/api/v1/user/auth/login",
      "/api/v1/user/auth/signup",
      "/api/v1/order/get-order",
      "/api/v1/order/import-order",
    ]
  }))
  app.use("/api/v1/user", userRouter)
  app.use("/api/v1/order", orderRouter)
}