const express = require("express");
const controller = require("../controllers/home_slider.js");
const verify = require("../middleware/authmiddleware.js");
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

router.put("/updateHomeStatus/:id", verify.verifyToken, controller.updateHomeSliderStatus);
router.get("/getHomeSlider", verify.verifyToken, controller.getHomeSlider);
router.get("/", controller.getHomeSlider);
router.get("/:id", controller.getByIdHomeSlider);
router.post("/", verify.verifyToken, upload.array("image"), controller.addHomeSlider);
router.put("/:id", verify.verifyToken, upload.array("image"), controller.updateHomeSlider);
router.delete("/:id", verify.verifyToken, controller.deleteHomeSlider);

module.exports = router;
