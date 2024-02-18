const express = require("express");
const controller = require("../controllers/role.js");
const verify = require("../middleware/authmiddleware.js");

const router = express.Router();

router.get("/loginRole",controller.getLoginRole)
router.get("/", verify.verifyToken, controller.getRole)
router.get("/:id", verify.verifyToken, controller.getByIdRole)
router.post("/", verify.verifyToken, controller.existData)
router.put("/:id", verify.verifyToken, controller.existData)
router.delete("/:id", verify.verifyToken, controller.deleteRole);

module.exports = router;
