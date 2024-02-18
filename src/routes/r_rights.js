const express = require("express");

const controllers = require("../controllers/rights.js");
const verify = require("../middleware/authmiddleware.js");

const rights = express.Router();

rights.get("/AccessRights/:id", controllers.getAccessRight);
rights.get("/:id", controllers.getRights);
rights.post("/", verify.verifyToken, controllers.insertData);

module.exports = rights;
