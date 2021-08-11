import express from 'express'
import { setup } from './src/api/routes/index.js';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { databaseConnection } from './src/database/index.js';
import { intigrateDB } from './src/api/entity/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })) // do not know the exactly use

setup(app)
intigrateDB()

databaseConnection()
.then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  })
})
.catch((error) => {
  console.log("Error in connecting to database", error);
})