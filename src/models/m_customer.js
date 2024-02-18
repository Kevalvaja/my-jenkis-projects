const mongoose = require("mongoose");

const customerField = mongoose.Schema({
  customer_name: {
    type: String,
    require: true,
  },
  role_id:{
    type: Number,
    require: true,
    ref: "roles"
  },
  image: {
    type: String,
    require: true,
  },
  email_id: {
    type: String,
    require: false,
  },
  mobile_no: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  city:{
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "cities"
  },
  state:{
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "states"
  },
  address: {
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

const postCustomer = mongoose.model("customers",customerField)
module.exports = postCustomer;