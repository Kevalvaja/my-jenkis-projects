const dotenv = require("dotenv");
dotenv.config();
//console.log(process.env);

const port = process.env.PORT;
const dbUser = process.env.DB_USERNAME;
const dbPwd = process.env.DB_PASSWORD;
const cloud_url = process.env.CLOUD_URL || "";
const contentType = process.env.CONTENT_TYPE || "application/json";
const env_type = process.env.ENV_TYPE || "dev";
const dbURL = process.env.DB_URL;
const dbName = process.env.DB_NAME;

const IMG_URL = "http://example.com/img"; // Replace with the actual image URL
const BUSINESS_PATH = "../businessGallary";
const BUSINESS_URL = `${IMG_URL}/${BUSINESS_PATH}/`;

module.exports = {
  port,
  dbUser,
  dbPwd,
  cloud_url,
  contentType,
  env_type,
  dotenv,
  dbURL,
  dbName,
  BUSINESS_PATH,
  BUSINESS_URL,
};
