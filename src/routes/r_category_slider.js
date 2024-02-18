const express = require("express");
const controller = require("../controllers/category_slider.js");
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

router.get("/categoryJoinFrontSide", controller.getCategorySliderJoinData);
router.put("/updateCStatus/:id", verify.verifyToken, controller.updateCategorySliderStatus);
router.get("/categorisSliderJoin", verify.verifyToken, controller.getCategorySliderJoinData);
router.get("/categorySliderById/:id", verify.verifyToken, controller.getByIdCategorySlider);
router.get("/", controller.getCategorySlider);
router.get("/:id", controller.getByIdCategorySlider);
router.post("/", verify.verifyToken, upload.array("image"), controller.addCategorySlider);
router.put("/:id", verify.verifyToken, upload.array("image"), controller.updateCategorySlider);
router.delete("/:id", verify.verifyToken, controller.deleteCategorySlider);

module.exports = router;
