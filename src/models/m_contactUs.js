const mongoose = require("mongoose");

const contactUs = mongoose.Schema({
  email_id: {
    type: String,
    require: true,
  },
  contact_no1: {
    type: Number,
    require: true,
  },
  contact_no2: {
    type: Number,
    require: false,
  },
  address1: {
    type: String,
    require: true,
  },
  address2: {
    type: String,
    require: false,
  },
  whatsapp_no: {
    type: Number,
    require: true,
  },
  facebook_url: {
    type: String,
    require: false,
  },
  instagram_url: {
    type: String,
    require: false,
  },
  youtube_url: {
    type: String,
    require: false,
  },
  google_url: {
    type: String,
    require: false,
  },
  linkedin_url: {
    type: String,
    require: false,
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
    required: true,
    ref: "roles",
  }
});

const postContactUs = mongoose.model("contact_us", contactUs);
module.exports = postContactUs;
