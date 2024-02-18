const mongoose = require("mongoose");
const Validator = require("mongoose-validator");
const validate = Validator;
var mobileno = [
  validate({
    validator: "isLength",
    arguments: [10, 10],
    message: "Please enter valid number",
  }),
];
const inquirySchema = mongoose.Schema({
  mobile_no: {
    type: String,
    require: true,
    validate: mobileno,
  },
  email_id: {
    type: String,
    required: true,
  },
  inquiry_message: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  entry_date: {
    type: Date,
    required: true,
  },
  update_date: {
    type: Date,
    required: false,
  },
});

const postInquiry = mongoose.model("inquiries", inquirySchema);
module.exports = postInquiry;
