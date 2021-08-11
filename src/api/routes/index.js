import { userRouter } from "./user.js"

export const setup = (app) => {
  app.use("/api/v1/user", userRouter)
}
