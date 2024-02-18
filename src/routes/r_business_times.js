const express = require("express");
const controller = require("../controllers/business_times.js");
const verify = require("../middleware/authmiddleware.js");

const router = express.Router();

router.get("/frontSideBusinessTime/:id", controller.getFrontSideBusinessTime);
router.get("/businessTimesJoinData", verify.verifyToken, controller.getBusinessTimesJoinData);
router.get("/businessTimeById/:id",verify.verifyToken, controller.getByIdBusinessTime);
router.get("/", controller.getBusinessTime);
router.get("/:id", controller.getByIdBusinessTime);
router.post("/", verify.verifyToken, controller.businessTimeExist);
router.put("/updateStatus/:id", verify.verifyToken, controller.updateStatus);
router.put("/", verify.verifyToken, controller.updateBusinessTime);
router.delete("/:id", controller.deleteBusinessTime);

module.exports = router;
