const express = require("express");
const controller = require("../controllers/mst_branch.js");
const verify = require("../middleware/authmiddleware.js");
const multer = require("multer");
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

router.get("/branchJoinData", verify.verifyToken, controller.getBranchJoin);
router.get("/getMstBranch", verify.verifyToken, controller.getMstBranch);
router.get("/mstBranchById/:id", verify.verifyToken, controller.getByIdMstBranch);
router.get("/", controller.getMstBranch);
router.get("/:id", controller.getByIdMstBranch);
router.post("/", verify.verifyToken, upload.single("main_image"), controller.existBranch);
router.put("/:id", verify.verifyToken, upload.single("main_image"), controller.existBranch);
router.delete("/:id", verify.verifyToken, controller.deleteMstBranch);

module.exports = router;
