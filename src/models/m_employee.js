const mongoose = require("mongoose");
const employee = mongoose.Schema({
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "mst_branches",
  },
  role_id: {
    type: Number,
    require: true,
    ref: "roles",
  },
  emp_name: {
    type: String,
    require: true,
  },
  emp_mobile1: {
    type: String,
    require: true,
  },
  emp_mobile2: {
    type: String,
    require: false,
  },
  email_id: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    reqwuire: true,
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
  emp_image: {
    type: String,
    require: true,
  },
  status: {
    type: Number,
    require: true,
  },
  entry_date: {
    type: Date,
    require: true,
  },
  entry_by: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "admins",
  },
  update_date: {
    type: Date,
    require: true,
  },
  update_by: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "admins",
  },
  role: {
    type: Number,
    require: true,
    ref: "roles",
  },
});

const postEmployee = mongoose.model("employees", employee);
module.exports = postEmployee;
