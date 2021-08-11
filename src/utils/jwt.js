import jwt from "jsonwebtoken";
import { privateKey } from "./jwt.config.js";

const getToken = (data) => {
  const bearerToken = `Bearer ${jwt.sign(data, privateKey)}`;
  return bearerToken;
}

const decodeToken = (token) => {
  const data = jwt.decode(token.slice(6));
  return data;
}

export {
  getToken,
  decodeToken
}