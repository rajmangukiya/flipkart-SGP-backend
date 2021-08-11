import { development } from "../../database/config.js";

const intigrateDB  = () => {
  development.sync();
}

export {
  intigrateDB
}
