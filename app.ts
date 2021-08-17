import express, { Application } from "express";
import { setup } from './src/api/routes/index';
import dotenv from "dotenv";
import { setSwagger } from './src/utils/swagger';
import { createConnection } from "typeorm";
import { development } from './src/database/config';
import { errors } from 'celebrate';
import cors from "cors"

dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })) // do not know the exactly use
app.use(cors({
  origin: 'http://localhost:3000'
}))

setup(app)
setSwagger(app)
app.use(errors());

createConnection(development)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  })
  .catch((e) => {
    console.log("Error: ", e);
  });