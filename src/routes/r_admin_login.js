const express = require("express");
const controller = require("../controllers/admin_login.js");
const router = express.Router();

router.get("/", controller.adminLogin);
router.get("/:id", controller.checkMobileno);
router.put("/:id", controller.forgetPsw);

module.exports = router;
