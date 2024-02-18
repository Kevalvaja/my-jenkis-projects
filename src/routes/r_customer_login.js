const express = require("express");
const controllers = require("../controllers/customer_login.js");
const verify = require("../middleware/authmiddleware.js")
const router = express.Router();

router.get("/", controllers.customerLogin);
router.get("/:id", controllers.checkMobileno);
router.put("/:id", controllers.forgetPsw);
router.put("/changesPassword/:id", verify.verifyToken, controllers.changesPassword);

module.exports = router;
