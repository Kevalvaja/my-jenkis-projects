const express = require("express");
const controller = require("../controllers/business_login.js");
const verify = require("../middleware/authmiddleware.js");
const router = express.Router();

router.get("/", controller.businessLogin);
router.get("/:id", controller.checkMobileno);
router.put("/:id", controller.forgetPsw);
router.put("/changesPassword/:id", verify.verifyToken, controller.changesPassword);

module.exports = router;
