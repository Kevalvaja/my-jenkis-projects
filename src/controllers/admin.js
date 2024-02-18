const postAdmin = require("../models/m_admin.js");
const decodeToken = require("./decodeToken.js");
const fs = require("fs");

const getAdmin = async (req, res) => {
  try {
    const admin = await postAdmin.find();
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdAdmin = async (req, res) => {
  try {
    const adminId =
      req?.query?.admin_id || decodeToken?.fetchId(req?.query?.userId);
    const admin = await postAdmin.find({ _id: adminId });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const adminExist = async (req, res) => {
  try {
    if (
      req.query.ProfileAdminId != undefined ||
      req.query.admin_id != undefined
    ) {
      const adminById =
        req?.query?.admin_id || decodeToken.fetchId(req?.query?.ProfileAdminId);
      await postAdmin
        .find({ _id: { $ne: adminById }, email_id: req?.body?.email_id })
        .then((emailExist) => {
          if (emailExist.length === 0) {
            postAdmin
              .find({
                _id: { $ne: adminById },
                mobile_no: req?.body?.mobile_no,
              })
              .then((MobileExist) => {
                if (MobileExist.length === 0) {
                  updateAdmin(req, res);
                } else {
                  res.status(200).json({ msg: "Mobile no is already exist." });
                }
              });
          } else {
            res.status(200).json({ msg: "Email Id is already exist." });
          }
        });
    } else {
      await postAdmin
        .find({ email_id: req?.body?.email_id })
        .then((emailExist) => {
          if (emailExist.length === 0) {
            postAdmin
              .find({ mobile_no: req?.body?.mobile_no })
              .then((MobileExist) => {
                if (MobileExist.length === 0) {
                  addAdmin(req, res);
                } else {
                  res.status(200).json({ msg: "Mobile no is already exist." });
                }
              });
          } else {
            res.status(200).json({ msg: "Email Id is already exist." });
          }
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const addAdmin = async (req, res) => {
  try {
    // const adminRole = await postRole.find({ role_id: 1 });
    const admin = req.body;
    admin.role_id = 1;
    admin.status = req?.body?.status || 1;
    admin.entry_date = new Date();
    admin.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    admin.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    admin.update_date = null;
    admin.update_by = null;
    admin.admin_image = req?.file?.filename || "no image";
    const newAdmin = new postAdmin(admin);
    newAdmin.save();
    res.status(200).json("Admin has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const adminById =
      req?.query?.admin_id || decodeToken.fetchId(req?.query?.ProfileAdminId);
    const getAdminData = await postAdmin.findById({ _id: adminById });
    const admin = req.body;
    admin.role_id = 1;
    admin.update_date = new Date();
    admin.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    admin.role = decodeToken?.RoleId(req?.headers["authorization"]) || null;
    admin.admin_image = req?.file?.filename || getAdminData?.admin_image;
    if (req?.file?.filename !== undefined) {
      fs.unlink(`./businessGallary/${getAdminData?.admin_image}`,async (err) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            await postAdmin.updateOne({ _id: adminById }, admin);
            res.status(200).json("Admin has been updated");
          }
        }
      );
    } else {
      await postAdmin.updateOne({ _id: adminById }, admin);
      res.status(200).json("Admin has been updated");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changesPassword = async (req, res) => {
  try {
    const getOldPassword = await postAdmin.findById({
      _id: decodeToken.fetchId(req?.params?.id),
    });
    const admin_password = req.body;
    admin_password.update_date = new Date();
    admin_password.update_by = decodeToken?.fetchId(
      req?.headers["authorization"]
    );
    admin_password.role = decodeToken?.RoleId(req?.headers["authorization"]);
    if (getOldPassword?.password === req?.body?.old_password) {
      await postAdmin.updateOne(
        { _id: decodeToken.fetchId(req?.params?.id) },
        admin_password
      );
      res.status(200).json("Change password successfully");
    } else {
      res.status(200).json({ msg: "Incorrect Old Password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAdminStatus = async (req, res) => {
  try {
    const admin = req.body;
    admin.update_date = new Date();
    admin.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    admin.role = decodeToken?.RoleId(req?.headers["authorization"]);
    await postAdmin.updateOne({ _id: req?.params?.id }, admin);
    res.status(200).json("Admin has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const getAdminData = await postAdmin.findById({ _id: adminId });
    if (getAdminData?.admin_image) {
      fs.unlink(`./businessGallary/${getAdminData?.admin_image}`,
        async (err) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            await postAdmin.deleteOne({ _id: adminId });
            res.status(200).json("Admin has been deleted");
          }
        }
      );
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAdmin,
  getByIdAdmin,
  adminExist,
  addAdmin,
  updateAdmin,
  changesPassword,
  updateAdminStatus,
  deleteAdmin,
};
