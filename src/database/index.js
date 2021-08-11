import { development } from './config.js';

const databaseConnection = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await development.authenticate();
      console.log("Connection has been established successfully.");
      resolve();
    } catch (error) {
      reject(error);
    }
  })
}

export {
  databaseConnection
}