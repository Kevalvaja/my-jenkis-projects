const express = require("express");
const controller = require("../controllers/admin.js");
const verify = require("../middleware/authmiddleware.js")
const multer = require("multer");
const path = require("path");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = ("businessGallary");
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

router.put("/changePassword/:id", verify.verifyToken, controller.changesPassword);
router.put("/updateStatus/:id", verify.verifyToken, controller.updateAdminStatus);
router.get("/", verify.verifyToken, controller.getAdmin);
router.get("/adminById", verify.verifyToken, controller.getByIdAdmin);
router.post("/", verify.verifyToken, upload.single("admin_image"), controller.adminExist);
router.put("/", verify.verifyToken, upload.single("admin_image"), controller.adminExist);
router.delete("/:id", verify.verifyToken, controller.deleteAdmin);

module.exports = router;
