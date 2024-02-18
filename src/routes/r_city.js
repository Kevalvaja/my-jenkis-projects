const express = require("express");
const controller = require("../controllers/city.js");
const verify = require("../middleware/authmiddleware.js");
const router = express.Router();

router.get("/cityJoinData", verify.verifyToken, controller.getCityJoinData);
router.get("/branchCity/:id", verify.verifyToken, controller.getBranchCity);
router.get("/getCity", verify.verifyToken, controller.getCity);
router.get("/cityById/:id", verify.verifyToken, controller.getByIdCity);
router.get("/", controller.getCity);
router.get("/:id", controller.getByIdCity);
router.post("/", verify.verifyToken, controller.existCity);
router.put("/:id", verify.verifyToken, controller.existCity);
router.delete("/:id", verify.verifyToken, controller.deleteCity);

module.exports = router;
