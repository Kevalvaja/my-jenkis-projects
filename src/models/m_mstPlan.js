const mongoose = require("mongoose");

const mstPlan = mongoose.Schema({
  plan_name: {
    type: String,
    require: true,
  },
  plan_front_image: {
    type: String,
    require: true,
  },
  plan_back_image: {
    type: String,
    require: true,
  },
  plan_validity: {
    type: Number,
    require: true,
  },
  plan_amount: {
    type: Number,
    require: true,
  },
  description: {
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
    ref: "admins"
  },
  update_date: {
    type: Date,
    require: true,
  },
  update_by: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "admins"
  },
  role: {
    type: Number,
    require: true,
    ref: "roles",
  },
});

const postMstPlan = mongoose.model("mst_plans", mstPlan);
module.exports = postMstPlan;
