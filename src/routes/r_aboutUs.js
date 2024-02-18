const express = require("express");
const controller = require("../controllers/aboutUs.js");
const verify = require("../middleware/authmiddleware.js");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = "businessGallary";
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", controller.getAboutUs);
router.get("/:id", controller.getByIdAboutUs);
router.post("/", verify.verifyToken, upload.single("about_image"), controller.addAboutUs);
router.put("/:id", verify.verifyToken, upload.single("about_image"), controller.updateAboutUs);
router.delete("/:id", verify.verifyToken, controller.deleteAboutUs);

module.exports = router;
