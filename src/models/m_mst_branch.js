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

const mstBranch = mongoose.Schema({
  branch_name: {
    type: String,
    require: true,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "cities",
  },
  address: {
    type: String,
    require: true,
  },
  mobile1: {
    type: String,
    require: true,
    validate: mobileno,
  },
  mobile2: {
    type: String,
    require: false,
    // validate: mobileno,
  },
  email: {
    type: String,
    require: true,
  },
  main_image: {
    type: String,
    require: false,
  },
  gstin: {
    type: String,
    require: false,
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
    ref: "admins"
  },
  update_date: {
    type: Date,
    required: false,
  },
  update_by: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "admins"
  },
  role: {
    type: Number,
    required: true,
    ref: "roles",
  },
});

const postMstBranch = mongoose.model("mst_branches", mstBranch);
module.exports = postMstBranch;
