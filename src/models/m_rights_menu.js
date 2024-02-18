const mongoose = require("mongoose");

const rightsMenu = new mongoose.Schema({
  menu_name: {
    type: String,
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

const postRightsMenu = mongoose.model("rights_menus", rightsMenu);
module.exports = postRightsMenu;
