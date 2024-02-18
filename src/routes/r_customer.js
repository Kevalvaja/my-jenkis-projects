const express = require("express");
const controller = require("../controllers/customer.js");
const verify = require("../middleware/authmiddleware.js")
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = "customerImages";
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + file.originalname);
  },
});
const upload = multer({ storage });
const router = express.Router();
router.get("/frontCustomer/:id", controller.getFrontCustomer);
router.get("/existCustomerMsg", controller.frontSideCustomerRegistration);// front check mobile no and email id exist msg
router.get("/", verify.verifyToken, controller.getCustomer);
router.get("/:id", verify.verifyToken, controller.getByIdCustomer);
router.post("/", upload.single("image"), controller.existCustomer);
router.put("/updateStatus/:id", verify.verifyToken, controller.updateCustomerStatus);
router.put("/:id", verify.verifyToken, upload.single("image"), controller.existCustomer);
router.delete("/:id", verify.verifyToken, controller.deleteCustomer);

module.exports = router;
