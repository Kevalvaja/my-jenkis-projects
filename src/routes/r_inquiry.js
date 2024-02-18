const express = require("express");
const controller = require("../controllers/inquiry.js");
const verify = require("../middleware/authmiddleware.js");
const router = express.Router();

router.get("/", controller.getInquiry);
router.get("/:id", controller.getByIdInquiry);
router.post("/", controller.addInquiry);
router.put("/:id", controller.updateInquiry);
router.delete("/:id", controller.deleteInquiry);

module.exports = router;
