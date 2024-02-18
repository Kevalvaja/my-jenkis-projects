const mongoose = require("mongoose");

const m_rights = new mongoose.Schema({
  role_id: {
    type: Number,
    require: true,
    ref: "roles",
  },
  rights_menu_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "rights_menus",
  },
  is_view: {
    type: Number,
    required: true,
  },
  is_added: {
    type: Number,
    required: true,
  },
  is_edited: {
    type: Number,
    required: true,
  },
  is_deleted: {
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
  role: {
    type: Number,
    required: true,
  },
});

const postRights = mongoose.model("rights", m_rights);
module.exports = postRights;