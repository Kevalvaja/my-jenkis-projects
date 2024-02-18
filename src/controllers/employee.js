const postEmployee = require("../models/m_employee.js");
const postMstBranch = require("../models/m_mst_branch.js");
const decodeToken = require("./decodeToken.js");
const mongoose = require("mongoose");
const fs = require("fs");
const getEmployee = async (req, res) => {
  try {
    const employee = await postEmployee.find();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdEmployee = async (req, res) => {
  try {
    let employeeId = req?.params?.id;
    if (decodeToken?.fetchId(req?.params?.id)) {
      employeeId = decodeToken?.fetchId(req?.params?.id);
    }
    const employee = await postEmployee.findById({ _id: employeeId });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const alreadyExist = async (req, res) => {
  try {
    let employeeId = req?.params?.id;
    if (decodeToken?.fetchId(req?.params?.id)) {
      employeeId = decodeToken?.fetchId(req?.params?.id);
    }
    if (employeeId) {
      await postEmployee
        .find({ _id: { $ne: employeeId }, email_id: req?.body?.email_id })
        .then((emailExist) => {
          if (emailExist.length == 0) {
            postEmployee
              .find({
                _id: { $ne: employeeId },
                emp_mobile1: req?.body?.emp_mobile1,
              })
              .then((mobileExist) => {
                if (mobileExist.length == 0) {
                  updateEmployee(req, res);
                } else {
                  res.status(200).json({ msg: "Mobileno is already exist" });
                }
              });
          } else {
            res.status(200).json({ msg: "Email Id is already exist." });
          }
        });
    } else {
      await postEmployee
        .find({ email_id: req?.body?.email_id })
        .then((emailExist) => {
          if (emailExist.length == 0) {
            postEmployee
              .find({ emp_mobile1: req?.body?.emp_mobile1 })
              .then((mobileExist) => {
                if (mobileExist.length == 0) {
                  addEmployee(req, res);
                } else {
                  res.status(200).json({ msg: "Mobileno is already exist" });
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

const addEmployee = async (req, res) => {
  try {
    const employee = req.body;
    /* getBranch id  city id wise */
    const getBranchCity = await postMstBranch.findOne({
      city_id: new mongoose.Types.ObjectId(employee?.city),
    });
    employee.branch_id = getBranchCity?._id;
    employee.status = req?.body?.status || 1;
    employee.entry_date = new Date();
    employee.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    employee.role = decodeToken?.RoleId(req?.headers["authorization"]) || "0";
    employee.update_date = null;
    employee.update_by = null;
    employee.emp_image = req?.file?.filename || "no image";
    const newEmployee = new postEmployee(employee);
    newEmployee.save();
    res.status(200).json("Employee has been inserted");
    /* check mobile no and email id already exist or not */
    // postEmployee.find({ email_id: employee.email_id }).then((emailExist) => {
    //   if (emailExist.length === 0) {
    //     postEmployee.find({$or: [{ emp_mobile1: employee.emp_mobile1 },{ emp_mobile2: employee.emp_mobile2 }]}).then((MobileExist) => {
    //         if (MobileExist.length === 0 || employee.emp_mobile2 == "") {
    //           const newEmployee = new postEmployee(employee);
    //           newEmployee.save();
    //           res.status(200).json("Employee has been inserted");
    //         } else {
    //           if (MobileExist[0].emp_mobile1 == employee.emp_mobile1) {
    //             res.status(200).json({ msg: "Mobileno1 is already exist" });
    //           } else {
    //             res.status(200).json({ msg: "Mobileno2 is already exist" });
    //           }
    //         }
    //       });
    //   } else {
    //     res.status(200).json({ msg: "Email Id is already exist." });
    //   }
    // });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    let employeeId = req?.params?.id;
    if (decodeToken?.fetchId(req?.params?.id)) {
      employeeId = decodeToken?.fetchId(req?.params?.id);
    }
    const getEmployeeData = await postEmployee.findById({ _id: employeeId });
    const employee = req.body;
    employee.update_date = new Date();
    employee.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    employee.role = decodeToken?.RoleId(req?.headers["authorization"]) || "0";
    employee.emp_image = req?.file?.filename || getEmployeeData?.emp_image;
    if(req?.file?.filename !== undefined){
      fs.unlink(`./businessGallary/${getEmployeeData?.emp_image}`, async(err)=>{
        if(err){
          return res.status(200).json(err)
        } else {
          await postEmployee.updateOne({ _id: employeeId }, employee);
          res.status(200).json("Employee has been updated");
        }
      })
    } else {
      await postEmployee.updateOne({ _id: employeeId }, employee);
      res.status(200).json("Employee has been updated");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const getEmployeeData = await postEmployee.findById({ _id: req?.params?.id });
    if(getEmployeeData?.emp_image){
      fs.unlink(`./businessGallary/${getEmployeeData?.emp_image}`, async(err)=>{
        if(err){
          return res.status(200).json(err)
        } else {
          await postEmployee.deleteOne({ _id: req?.params?.id });
          res.status(200).json("Employee has been deleted");
        }
      })
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const employeeJoin = async (req, res) => {
  try {
    const role = decodeToken?.RoleId(req?.headers["authorization"]);
    let joinData = [];
    if (role == 1) {
      joinData = await postEmployee.aggregate([
        {
          $lookup: {
            from: "mst_branches",
            localField: "branch_id",
            foreignField: "_id",
            as: "branch_data",
          },
        },
        {
          $lookup: {
            from: "cities",
            localField: "city",
            foreignField: "_id",
            as: "city_data",
          },
        },
        {
          $lookup: {
            from: "roles",
            localField: "role_id",
            foreignField: "role_id",
            as: "role_data",
          },
        },
      ]);
    } else {
      const empData = await postEmployee.find({
        _id: decodeToken?.fetchId(req?.headers["authorization"]),
      });
      joinData = await postEmployee.aggregate([
        {
          $match: { branch_id: empData?.[0]?.branch_id },
        },
        {
          $lookup: {
            from: "mst_branches",
            localField: "branch_id",
            foreignField: "_id",
            as: "branch_data",
          },
        },
        {
          $lookup: {
            from: "cities",
            localField: "city",
            foreignField: "_id",
            as: "city_data",
          },
        },
        {
          $lookup: {
            from: "roles",
            localField: "role_id",
            foreignField: "role_id",
            as: "role_data",
          },
        },
      ]);
    }
    res.status(200).json(joinData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changesPassword = async (req, res) => {
  try {
    console.log("call function");
    const getOldPassword = await postEmployee.findById({
      _id: decodeToken.fetchId(req?.params?.id),
    });
    const userpassword = req.body;
    userpassword.update_date = new Date();
    userpassword.update_by = decodeToken?.fetchId(
      req?.headers["authorization"]
    );
    userpassword.role = decodeToken?.RoleId(req?.headers["authorization"]);
    if (getOldPassword?.password === req?.body?.old_password) {
      await postEmployee.updateOne(
        { _id: decodeToken.fetchId(req?.params?.id) },
        userpassword
      );
      res.status(200).json("Change password successfully");
    } else {
      res.status(200).json({ msg: "Incorrect Old Password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getEmployee,
  getByIdEmployee,
  alreadyExist,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  employeeJoin,
  changesPassword,
};
