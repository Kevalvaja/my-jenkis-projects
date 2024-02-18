const postMstBranch = require("../models/m_mst_branch.js");
const postMstBusiness = require("../models/m_mst_business.js");
const postEmployee = require("../models/m_employee.js");
const decodeToken = require("./decodeToken.js");
const fs = require("fs");
const accessRights = require("./rightsAccessData.js");
const { default: mongoose } = require("mongoose");

const getMstBranch = async (req, res) => {
  try {
    let mstBranch = "";
    if(req?.query?.branchId) {
      const employee_id = decodeToken?.fetchId(req?.headers['authorization']);
      const mstEmployee = await postEmployee.findById({_id: employee_id});
      mstBranch = await postMstBranch.find({ _id: mstEmployee?.branch_id, status: 1 })
    }
    if (!req?.query?.active && !req?.query?.branchId) {
      mstBranch = await postMstBranch.find({ status: 1 })
    } else {
      mstBranch = await postMstBranch.find();
    }
    res.status(200).json(mstBranch);
  } catch (error) {
    console.log(error);
  }
};

const getByIdMstBranch = async (req, res) => {
  try {
    const mstBranch = await postMstBranch.findById({ _id: req.params.id });
    res.status(200).json(mstBranch);
  } catch (error) {
    console.log(error);
  }
};

const existBranch = async (req, res) => {
  try {
    if (req?.params?.id) {
      await postMstBranch
        .find({ _id: { $ne: req?.params?.id }, email: req?.body?.email })
        .then((emailExist) => {
          if (emailExist.length === 0) {
            postMstBranch
              .find({
                _id: { $ne: req?.params?.id },
                mobile1: req?.body?.mobile1,
              })
              .then((mobilenoExist) => {
                if (mobilenoExist.length === 0) {
                  updateMstBranch(req, res);
                } else {
                  res.status(200).json({ msg: "Mobileno is already exist." });
                }
              });
          } else {
            res.status(200).json({ msg: "Email id is already exist." });
          }
        });
    } else {
      await postMstBranch
        .find({ email: req?.body?.email })
        .then((emailExist) => {
          if (emailExist.length === 0) {
            postMstBranch
              .find({ mobile1: req?.body?.mobile1 })
              .then((mobilenoExist) => {
                if (mobilenoExist.length === 0) {
                  addMstBranch(req, res);
                } else {
                  res.status(200).json({ msg: "Mobileno1 is already exist." });
                }
              });
          } else {
            res.status(200).json({ msg: "Email id is already exist." });
          }
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const addMstBranch = async (req, res) => {
  try {
    const mstBranch = req.body;
    mstBranch.status = req.body.status || 1;
    mstBranch.entry_date = new Date();
    mstBranch.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    mstBranch.role = decodeToken?.RoleId(req?.headers["authorization"]) || "0";
    mstBranch.update_date = null;
    mstBranch.update_by = null;
    mstBranch.main_image = req?.file?.filename || "no image";
    const newMstBranch = new postMstBranch(mstBranch);
    newMstBranch.save();
    res.status(200).json("Branch has been inserted");
  } catch (error) {
    console.log(error);
  }
};

const updateMstBranch = async (req, res) => {
  try {
    const getBranchImage = await postMstBranch.findById({ _id: req.params.id });
    const mstBranch = req.body;
    mstBranch.update_date = new Date();
    mstBranch.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    mstBranch.role = decodeToken?.RoleId(req?.headers["authorization"]) || "0";
    mstBranch.main_image = req?.file?.filename || getBranchImage?.main_image;
    if(req?.file?.filename !== undefined){
      fs.unlink(`./businessGallary/${getBranchImage?.main_image}`, async(err)=>{
        if(err){
          return res.status(200).json(err)
        } else {
          await postMstBranch.updateOne({ _id: req?.params?.id }, mstBranch);
          res.status(200).json("Branch has been updated");
        }
      })
    } else {
      await postMstBranch.updateOne({ _id: req?.params?.id }, mstBranch);
      res.status(200).json("Branch has been updated");
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteMstBranch = async (req, res) => {
  try {
    await postMstBusiness
      .find({ branch_id: req?.params?.id })
      .then((mstBusinessData) => {
        if (mstBusinessData.length === 0 || mstBusinessData.length === "0") {
          postEmployee
            .find({ branch_id: req?.params?.id })
            .then((employeeData) => {
              if (employeeData.length === 0 || employeeData.length === "0") {
                const deleteFunction = async () => {
                  const getBranchImage = await postMstBranch.findById({ _id: req?.params?.id });
                  fs.unlink(`./businessGallary/${getBranchImage?.main_image}`, async(err)=>{
                    if(err) {
                      return res.status(200).json(err)
                    } else {
                      await postMstBranch.deleteOne({ _id: req?.params?.id });
                      res.status(200).json("Branch has been deleted");
                    }
                  })
                };
                deleteFunction();
              } else {
                res.status(200).json({
                  msg: "Branch can not be delete because it is use somewhere else...",
                });
              }
            });
        } else {
          res.status(200).json({
            msg: "Branch can not be delete because it is use somewhere else...",
          });
        }
      });
    // await postMstBranch.deleteOne({ _id: req.params.id });
    // res.status(200).json("Branch has been deleted");
  } catch (error) {
    console.log(error);
  }
};

const getBranchJoin = async (req, res) => {
  try {
    const role = decodeToken?.RoleId(req?.headers["authorization"]);
    let branchJoin = [];
    if (role == 1) {
      branchJoin = await postMstBranch.aggregate([
        {
          $lookup: {
            from: "cities",
            localField: "city_id",
            foreignField: "_id",
            as: "city_data",
          },
        },
      ]);
    } else {
      // const accessId = await accessRights?.rightsAccessData(
      //   decodeToken?.fetchId(req?.headers["authorization"])
      // );
      branchJoin = await postMstBranch.aggregate([
        // {
        //   $match: { city_id: accessId },
        // },
        {
          $lookup: {
            from: "cities",
            localField: "city_id",
            foreignField: "_id",
            as: "city_data",
          },
        },
      ]);
    }
    res.status(200).json(branchJoin);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMstBranch,
  getByIdMstBranch,
  existBranch,
  addMstBranch,
  updateMstBranch,
  deleteMstBranch,
  getBranchJoin,
};
