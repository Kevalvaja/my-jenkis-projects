const express = require("express");
const multer = require("multer");
const controller = require("../controllers/business_facilities.js");
const verify = require("../middleware/authmiddleware.js");
const router = express.Router();
const path = require("path");
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

router.get("/businessFacilitiesJoinData", verify.verifyToken ,controller.getBusinessFacilitiesJoinData);
router.get("/frontSideBusinessFacilities/:id",controller.getBusinessFacilitiesFrontSide)
router.get("/businessFacilitiesImages/:id",controller.getBusinessFacilitiesImages)
// router.get("/getBusinessFacilities", verify.verifyToken, controller.getBusinessFacilities);
router.get("/businessById/:id", verify.verifyToken, controller.getByIdBusinessFacilities);
router.get("/", controller.getBusinessFacilities);
router.get("/:id", controller.getByIdBusinessFacilities);
router.post("/", verify.verifyToken, upload.array("image"), controller.existBusinessFacilitiesData);
router.put("/:id", verify.verifyToken, upload.array("image"), controller.existBusinessFacilitiesData);
router.delete("/deleteFImage/:id", verify.verifyToken, controller.deleteFImages);
router.delete("/:id", verify.verifyToken, controller.deleteBusinessFacilities);

module.exports = router;
