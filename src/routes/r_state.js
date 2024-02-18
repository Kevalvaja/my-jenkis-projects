const express = require("express");
const controller = require("../controllers/state.js");
const verify = require("../middleware/authmiddleware.js");

const router = express.Router();

router.get("/getState", verify.verifyToken, controller.getState);
router.get("/stateById/:id", verify.verifyToken, controller.getByIdState);
router.get("/", controller.getState);
router.get("/:id", controller.getByIdState);
router.post("/", verify.verifyToken, controller.stateExist);
router.put("/:id",verify.verifyToken, controller.stateExist);
router.delete("/:id", verify.verifyToken, controller.deleteState);

module.exports = router;
