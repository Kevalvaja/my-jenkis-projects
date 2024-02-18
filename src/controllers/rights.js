const postRights = require("../models/m_rights.js");
const decodeToken = require("../controllers/decodeToken.js")

const getRights = async (req, res) => {
  try {
    // const data = decodeToken?.RoleId(req?.params?.id)
    // console.log(data);
    const rights = await postRights.aggregate([
      { 
        $match: { role_id: decodeToken?.RoleId(req?.params?.id) }
      },
      {
        $lookup: {
          from: "rights_menus",
          localField: "rights_menu_id",
          foreignField: "_id",
          as: "rights_menus",
        },
      },
      {
        $unwind: "$rights_menus",
      },
      {
        $project: {
          _id: 1,
          is_view: 1,
          is_added: 1,
          is_edited: 1,
          is_deleted: 1,
          menu_name: "$rights_menus.menu_name",
        }
      }
    ]);
    res.status(200).json(rights);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAccessRight = async (req, res) => {
  try { 
    const rightsData = await postRights.find({ role_id: req?.params?.id });
    res.status(200).json(rightsData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const insertData = async (req, res) => {
  try {
    const checkboxValues = req.body.checkboxValues; 
    const values = [];
    const entry_date = new Date();
    const entry_by = decodeToken.fetchId(req?.headers["authorization"]);;
    const role = decodeToken.RoleId(req?.headers["authorization"]);
    Object.entries(checkboxValues.is_view).forEach(
      ([rights_menu_id, is_view]) => {
        const is_add = checkboxValues?.is_add[rights_menu_id || null] || 0;
        const is_edit = checkboxValues?.is_edit[rights_menu_id || null] || 0;
        const is_delete = checkboxValues?.is_delete[rights_menu_id || null] || 0;        
        values.push({role_id: req.body.role_id, rights_menu_id: rights_menu_id, is_view:is_view, is_added:is_add, is_edited:is_edit, is_deleted:is_delete, entry_date: entry_date, entry_by:entry_by, role:role});
      }
    );
    await postRights.deleteMany({ role_id: req.body.role_id })
    for (let i = 0; i < values.length; i++) {
      const newRightsData = new postRights(values[i]);
      newRightsData.save();
    }
    res.status(200).json("Rights add successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getRights, getAccessRight, insertData };