const mongoose = require("mongoose");

const city = new mongoose.Schema({
  state_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "states",
  },
  city_name: {
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

const postCity = mongoose.model("cities", city);
module.exports = postCity;
