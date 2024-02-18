const express = require("express");
const controller = require("../controllers/contactUs.js");
const verify = require("../middleware/authmiddleware.js");
const router = express.Router();

router.get("/", controller.getContactUs);
router.get("/:id", controller.getByIdContactUs);
router.post("/", verify.verifyToken, controller.addContactUs);
router.put("/:id", verify.verifyToken, controller.updateContactUs);
router.delete("/:id", verify.verifyToken, controller.deleteContactUs);

module.exports = router;
