const mongoose = require("mongoose");

const mstCategory = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  // branch_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   require: true,
  //   ref: "mst_branches",
  // },
  parent_category: {
    type: mongoose.Schema.Types.ObjectId || String,
    require: true,
    ref: "mst_categories",
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

const postMstCategory = mongoose.model("mst_categories", mstCategory);
module.exports = postMstCategory;
