const mongoose = require("mongoose");

const businessFacilities = new mongoose.Schema({
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "mst_businesses",
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  type: {
    type: Number,
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

const postBusinessFacilities = mongoose.model(
  "business_facilities",
  businessFacilities
);
module.exports = postBusinessFacilities;
