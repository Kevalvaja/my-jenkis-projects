const express = require("express");
const multer = require("multer");
const controller = require("../controllers/mstPlan.js");
const verify = require("../middleware/authmiddleware.js");
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
const upload = multer({ storage }).fields([
  { name: "plan_front_image", maxCount: 1 },
  { name: "plan_back_image", maxCount: 1 },
]);

router.get("/getMstPlans", verify.verifyToken, controller.getMstPlan);
router.get("/planById/:id", controller.getByIdMstPlan);
router.get("/", controller.getMstPlan);
router.get("/:id", controller.getByIdMstPlan);
router.post("/", verify.verifyToken, upload, controller.existPlan);
router.put("/:id", verify.verifyToken, upload, controller.existPlan);
router.delete("/:id", verify.verifyToken, controller.deleteMstPlan);

module.exports = router;