const mongoose = require("mongoose");

const bussinessSlider = new mongoose.Schema({
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "mst_business",
  },
  image: {
    type: String,
    require: true,
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

const postBusinessSlider = mongoose.model("business_sliders", bussinessSlider);
module.exports = postBusinessSlider;
