const express = require("express");
const controller = require("../controllers/my_plans.js");
const verify = require("../middleware/authmiddleware.js");
const router = express.Router();

router.get("/:id", controller.getMyPlans);

module.exports = router