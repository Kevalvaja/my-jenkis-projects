const express = require("express");

const controllers = require("../controllers/rights_menu.js");
const verify = require("../middleware/authmiddleware.js");

const rights_menu = express.Router();

rights_menu.get("/", verify.verifyToken, controllers.getRightsMenu);
rights_menu.get("/:id", verify.verifyToken, controllers.getRightsMenuById);
rights_menu.post("/", verify.verifyToken, controllers.alreadyExist);
rights_menu.put("/:id", verify.verifyToken, controllers.alreadyExist);
rights_menu.delete("/:id", verify.verifyToken, controllers.deleteRightsMenu);

module.exports = rights_menu;