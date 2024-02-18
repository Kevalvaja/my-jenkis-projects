const postRole = require("../models/m_role.js");
const decodeToken = require("./decodeToken.js");

const getRole = async (req, res) => {
  try {
    let role = "";
    if (!req?.query?.active) {
      role = await postRole.find({ status: 1 });
    } else {
      role = await postRole.find();
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLoginRole = async (req, res) => {
  try {
    const role = await postRole
      .find({ status: 1, role_id: { $ne: 3 } })
      .select("role_name role_id");
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdRole = async (req, res) => {
  try {
    const roleData = await postRole.find({ _id: req?.params?.id });
    res.status(200).json(roleData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const existData = async (req, res) => {
  try {
    if (req?.params?.id) {
      await postRole
        .find({
          _id: { $ne: req?.params?.id },
          role_name: req?.body?.role_name,
        })
        .then((existData) => {
          if (existData.length === 0) {
            updateRole(req, res);
          } else {
            res.status(200).json({ msg: "Role name already exist" });
          }
        });
    } else {
      await postRole
        .find({ role_name: req?.body?.role_name })
        .then((existData) => {
          if (existData.length === 0) {
            addRole(req, res);
          } else {
            res.status(200).json({ msg: "Role name already exist" });
          }
        });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addRole = async (req, res) => {
  try {
    const getLastInsertedRole = await postRole
      .find()
      .sort({ _id: -1 })
      .limit(1);
    const roleData = req.body;
    roleData.status = req?.body?.status || 1;
    roleData.entry_date = new Date();
    roleData.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    roleData.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    roleData.update_date = null;
    roleData.update_by = null;
    if (
      getLastInsertedRole.length === 0 ||
      getLastInsertedRole.length === "0"
    ) {
      roleData.role_id = 1;
    } else {
      roleData.role_id = getLastInsertedRole[0].role_id + 1;
    }
    const newRoleData = new postRole(roleData);
    newRoleData.save();
    res.status(200).json("Role has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const putRole = req.body;
    putRole.status = req?.body?.status || 1;
    putRole.update_date = new Date();
    putRole.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    putRole.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    await postRole.updateOne({ _id: req?.params?.id }, putRole);
    res.status(200).json("Role has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    await postRole.deleteOne({ _id: req?.params?.id });
    res.status(200).json("Role has been deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getLoginRole,
  getRole,
  getByIdRole,
  existData,
  addRole,
  updateRole,
  deleteRole,
};
