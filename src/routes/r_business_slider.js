const express = require("express");
const controller = require("../controllers/business_slider.js");
const verify = require("../middleware/authmiddleware.js");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath =("businessGallary");
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

router.put("/businessSliderStatus/:id", verify.verifyToken, controller.updateBusinessSliderStatus);
router.get("/frontBusinessSlider/:id", controller.getFrontBusinessSlider);
router.get("/businessSliderJoinData", verify.verifyToken, controller.getBusinessSliderJoinData);
router.get("/businessSliderById/:id", verify.verifyToken, controller.getByIdBusinessSlider);
router.get("/", controller.getBusinessSlider);
router.get("/:id", controller.getByIdBusinessSlider);
router.post("/", verify.verifyToken, upload.array("image"), controller.addBusinessSlider);
router.put("/:id", verify.verifyToken, upload.array("image"), controller.updateBusinessSlider);
router.delete("/:id", verify.verifyToken, controller.deleteBusinessSlider);

module.exports = router;
