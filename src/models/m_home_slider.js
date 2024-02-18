const mongoose = require("mongoose");
const homeSlider = mongoose.Schema({
  slider_type: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  status:{
    type: Number,
    require: true
  },
  entry_by: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "admins",
  },
  entry_date: {
    type: Date,
    require: true,
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

const postHomeSlider = mongoose.model("home_sliders", homeSlider);
module.exports =  postHomeSlider;