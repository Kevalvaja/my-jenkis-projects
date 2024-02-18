const mongoose = require("mongoose");

const aboutUs = mongoose.Schema({
  about_image: {
    type: String,
    require: true,
  },
  about_description: {
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

const postAboutUs = mongoose.model("about_us", aboutUs);
module.exports = postAboutUs;
