const express = require("express");
const controller = require("../controllers/employee.js");
const verify = require("../middleware/authmiddleware.js");
const multer = require("multer");
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

router.get("/employeeJoinData", verify.verifyToken, controller.employeeJoin);
router.get("/", verify.verifyToken, controller.getEmployee);
router.get("/:id",verify.verifyToken, controller.getByIdEmployee);
router.post("/", verify.verifyToken, upload.single("emp_image"), controller.alreadyExist);
router.put("/changesPassword/:id", verify.verifyToken, controller.changesPassword);
router.put("/:id", verify.verifyToken, upload.single("emp_image"), controller.alreadyExist);
router.delete("/:id", verify.verifyToken, controller.deleteEmployee);

module.exports = router;