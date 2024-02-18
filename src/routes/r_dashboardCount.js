const express = require("express");
// const verify = require("../middleware/authmiddleware.js");
const controllers = require("../controllers/dashboardCount.js");
const router = express.Router();

router.get("/", controllers.getCountData);

module.exports = router;