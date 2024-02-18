const mongoose = require("mongoose");

const categorySlider = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "mst_category",
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

const postCategorySlider = mongoose.model("category_slider", categorySlider);
module.exports = postCategorySlider;
