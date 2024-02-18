const express = require("express");
const controller = require("../controllers/mst_business.js");
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
router.get("/existbusinessMsg", controller.frontSideBusinessRegistration);// front check mobile no and email id exist msg
router.get("/publicFrontBusiness", controller.frontPublicMstBusiness);
router.get("/filterBusiness", controller.getFilterBusiness);
router.get("/frontPublicSearchFilter/:id", controller.frontPublicSearchFilter); // city wise get category data api
router.get("/businessWiseCategory", controller.getBusinessWiseCategory);
router.get("/businessJoinDataFrontSide/:id", controller.businessJoinDataFrontSide);
router.get("/frontPublicByIdMstBusiness/:id", controller.frontPublicByIdMstBusiness);
router.get("/frontBusinessName/:id", controller.getBusinessName);
router.get("/", verify.verifyToken, controller.getMstBusiness);
router.get("/businessProfile", verify.verifyToken, controller.getBusinessProfile);
router.get("/BusinessJoinData", verify.verifyToken, controller.getBusinessJoin);
router.get("/:id", verify.verifyToken, controller.getByIdMstBusiness);
router.post("/", upload.single("main_image"), controller.businessExist);
router.put("/statusUpdate/:id", verify.verifyToken, controller.statusUpdateMstBusiness);
router.put("/:id", verify.verifyToken, upload.single("main_image"), controller.businessExist);
router.delete("/:id", verify.verifyToken, controller.deleteMstBusiness);

module.exports = router;
