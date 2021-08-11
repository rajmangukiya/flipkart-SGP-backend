import express from 'express'
import { setup } from './src/api/routes/index.js';
import dotenv from "dotenv";
import bodyParser from 'body-parser';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })) // do not know the exactly use

setup(app)

app.post('/', (req, res) => {
  console.log(req.body);
})


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})