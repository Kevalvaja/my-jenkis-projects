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

const admin = new mongoose.Schema({
  admin_name: {
    type: String,
    require: true,
  },
  role_id:{
    type: Number,
    require: true,
    ref: "roles"
  },
  admin_image: {
    type: String,
    require: true,
  },
  email_id: {
    type: String,
    require: true,
  },
  mobile_no: {
    type: String,
    required: true,
    validate: mobileno,
  },
  password: {
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
  entry_by: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "admins",
  },
  update_date: {
    type: Date,
    required: false,
  },
  update_by: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "admins",
  },
  role: {
    type: Number,
    required: true,
    ref: "roles",
  },
});

const postAdmin = mongoose.model("admin", admin);

module.exports = postAdmin;
