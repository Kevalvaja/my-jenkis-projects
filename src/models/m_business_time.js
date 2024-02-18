const mongoose = require("mongoose");

const businessTime = new mongoose.Schema({
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "mst_businesses",
  },
  day_name: {
    type: String,
    require: true,
  },
  open_time: {
    type: String,
    required: true,
  },
  close_time: {
    type: String,
    required: true,
  },
  break_open_time: {
    type: String,
    required: true,
  },
  break_close_time: {
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

const postBusinessTime = mongoose.model("business_times", businessTime);
module.exports = postBusinessTime;
