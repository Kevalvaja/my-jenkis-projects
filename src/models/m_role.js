const mongoose = require("mongoose");

const role = mongoose.Schema({
  role_id: {
    type: Number,
    require: true,
  },
  role_name: {
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
  role:{
    type: Number,
    require: true,
  }
});

const postRole = mongoose.model("roles", role);
module.exports = postRole;
