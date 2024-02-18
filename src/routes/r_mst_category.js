const express = require("express");
const controller = require("../controllers/mst_category.js");
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

router.get("/groupByCategory", controller.getGroupByCategory);
router.get("/getFrontBusinessSingup", controller.getFrontBusinessSingup);
router.get("/categorySelfJoinData", verify.verifyToken, controller.getCategorySelfJoinData);
router.put("/mstCategoryStatus/:id", verify.verifyToken, controller.updateMstCategoryStatus);
router.get("/getMstCategory", verify.verifyToken, controller.getMstCategory);
router.get("/mstCategoryById/:id", verify.verifyToken, controller.getByIdMstCategory);
router.get("/", controller.getMstCategory);
router.get("/:id", controller.getByIdMstCategory);
router.post("/", verify.verifyToken, upload.single("image"), controller.exitMstCategory);
router.put("/:id", verify.verifyToken, upload.single("image"), controller.exitMstCategory);
router.delete("/:id", verify.verifyToken, controller.deleteMstCategory);

module.exports = router;
