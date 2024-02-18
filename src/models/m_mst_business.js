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

const mstBusiness = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "mst_branches",
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "mst_categories",
  },
  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "mst_plans",
  },
  role_id:{
    type: Number,
    require: true,
    ref: "roles"
  },
  plan_expiry_date:{
    type: Date,
    require: true
  },
  card_date: {
    type: Number,
    require: true,
  },
  card_no: {
    type: String,
    require: true,
  },
  mode_of_payment:{
    type: String,
    require: true,
  },
  establishment_year:{
    type: Number,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "cities",
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "states",
  },
  mobile1: {
    type: String,
    require: true,
    validate: mobileno,
  },
  password: {
    type: String,
    require: true,
  },
  mobile2: {
    type: String,
    require: false,
  },
  email: {
    type: String,
    require: false,
  },
  website: {
    type: String,
    require: false,
  },
  main_image: {
    type: String,
    require: true,
  },
  qr_code_img:{
    type: String,
    require: true,
  },
  GSTIN: {
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

const postMstBusiness = mongoose.model("mst_businesses", mstBusiness);
module.exports = postMstBusiness;
