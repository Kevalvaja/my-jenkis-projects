const postMstBusiness = require("../models/m_mst_business.js");
const postMstBranch = require("../models/m_mst_branch.js");
const postMstPlan = require("../models/m_mstPlan.js");
const decodeToken = require("./decodeToken.js");
const postBusinessFacilities = require("../models/m_business_facilities.js");
const postBusinessSlider = require("../models/m_business_slider.js");
const postBusinessTime = require("../models/m_business_time.js");
const QRCode = require("qrcode");
const mongoose = require("mongoose");
const buffer = require("buffer");
// const path = require("path");
const fs = require("fs");
const accessRights = require("./rightsAccessData.js");
// const config = require("../configs/config.js");

const frontPublicMstBusiness = async (req, res) => {
  try {
    const mstBusiness = await postMstBusiness
      .find({ status: 1 })
      .select("-password")
      .sort({ name: 1 });
    res.status(200).json(mstBusiness);
  } catch (error) {
    console.log(error);
  }
};

const getBusinessProfile = async (req, res) => {
  try {
    const businessId = decodeToken.fetchId(req?.query?.userId);
    const busienssProfile = await postMstBusiness.findById({ _id: businessId });
    res.status(200).json(busienssProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const frontPublicSearchFilter = async (req, res) => {
  try {
    const mstBusiness = await postMstBusiness.aggregate([
      {
        $match: {
          city: mongoose.Types.ObjectId.createFromHexString(req?.params?.id),
          status: 1,
        },
      },
      {
        $lookup: {
          from: "mst_categories",
          localField: "category_id",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $unwind: "$categories",
      },
      {
        $group: {
          _id: "$categories._id", // Group by the _id field of categories
          categories_name: { $first: "$categories.title" },
        },
      },
    ]);
    res.status(200).json(mstBusiness);
  } catch (error) {
    console.log(error);
  }
};

const getBusinessWiseCategory = async (req, res) => {
  try {
    const mstBusiness = await postMstBusiness
      .find({
        $and: [
          { category_id: req?.query?.categoryId },
          { city: req?.query?.cityId },
          { status: 1 },
        ],
      }).sort({name: -1})
      .select("-password");
    // { category_id: req?.params?.id }
    res.status(200).json(mstBusiness);
  } catch (error) {
    console.log(error);
  }
};

const getFilterBusiness = async (req, res) => {
  try {
    const mstBusiness = await postMstBusiness
      .find({
        _id: mongoose.Types.ObjectId.createFromHexString(req?.query?.businessId),
        status: 1,
      }).sort({name: 1})
      .select("-password");
    res.status(200).json(mstBusiness);
  } catch (error) {
    console.log(error);
  }
};

const frontPublicByIdMstBusiness = async (req, res) => {
  try {
    const mstBusiness = await postMstBusiness
      .findById({ _id: req.params.id })
      .select("-password");
    res.status(200).json(mstBusiness);
  } catch (error) {
    console.log(error);
  }
};

const getMstBusiness = async (req, res) => {
  try {
    let role = decodeToken?.RoleId(req?.headers["authorization"]);
    let mstBusiness = "";
    if (!req?.query?.active) {
      if (role == 1) {
        mstBusiness = await postMstBusiness
          .find({ status: 1 })
          .select("-password");
      } else if (role == 2) {
        mstBusiness = await postMstBusiness
          .find({
            _id: decodeToken?.fetchId(req?.headers["authorization"]),
            status: 1,
          })
          .select("-password");
      } else {
        const accessId = await accessRights?.rightsAccessData(
          decodeToken?.fetchId(req?.headers["authorization"])
        );
        mstBusiness = await postMstBusiness
          .find({ city: accessId, status: 1 })
          .select("-password");
      }
    } else {
      if (role == 1) {
        mstBusiness = await postMstBusiness.find().select("-password");
      } else if (role == 2) {
        mstBusiness = await postMstBusiness
          .find({ _id: decodeToken?.fetchId(req?.headers["authorization"]) })
          .select("-password");
      } else {
        const accessId = await accessRights?.rightsAccessData(
          decodeToken?.fetchId(req?.headers["authorization"])
        );
        mstBusiness = await postMstBusiness
          .find({ city: accessId })
          .select("-password");
      }
    }
    res.status(200).json(mstBusiness);
  } catch (error) {
    console.log(error);
  }
};

const getByIdMstBusiness = async (req, res) => {
  try {
    let mstBusiness = "";
    if (decodeToken?.fetchId(req?.params?.id) === undefined) {
      mstBusiness = await postMstBusiness.findById({ _id: req?.params?.id });
    } else {
      mstBusiness = await postMstBusiness
        .find({
          _id: mongoose.Types.ObjectId.createFromHexString(
            decodeToken?.fetchId(req?.params?.id)
          ),
        })
        .populate({ path: "city", select: "city_name", match: { status: 1 } })
        .populate({
          path: "state",
          select: "state_name",
          match: { status: 1 },
        });
    }
    res.status(200).json(mstBusiness);
  } catch (error) {
    console.log(error);
  }
};

const getBusinessName = async (req, res) => {
  try {
    const mstBusiness = await postMstBusiness
      .find({ _id: decodeToken.fetchId(req?.params?.id) })
      .select("name");
    res.status(200).json(...mstBusiness);
  } catch (error) {
    console.log(error);
  }
};

const frontSideBusinessRegistration = async (req, res) => {
  try {
    await postMstBusiness
      .find({ email: req?.query?.email })
      .then((emailExist) => {
        if (emailExist?.length === 0) {
          postMstBusiness
            .find({ mobile1: req?.query?.mobile1 })
            .then((MobileExist) => {
              if (MobileExist.length === 0) {
                res.status(200).json({ data: 1 });
              } else {
                res.status(200).json({ msg: "Mobileno is already exist" });
              }
            });
        } else {
          res.status(200).json({ msg: "Email Id is already exist." });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

const businessExist = async (req, res) => {
  try {
    let businessId = req?.params?.id;
    if (decodeToken?.fetchId(req?.params?.id)) {
      businessId = mongoose.Types.ObjectId.createFromHexString(
        decodeToken?.fetchId(req?.params?.id)
      );
    }
    if (businessId) {
      await postMstBusiness
        .find({ _id: { $ne: businessId }, email: req?.body?.email })
        .then((emailExist) => {
          if (emailExist?.length === 0) {
            postMstBusiness
              .find({ _id: { $ne: businessId }, mobile1: req?.body?.mobile1 })
              .then((MobileExist) => {
                if (MobileExist.length === 0) {
                  updateMstBusiness(req, res);
                } else {
                  res.status(200).json({ msg: "Mobileno is already exist" });
                }
              });
          } else {
            res.status(200).json({ msg: "Email Id is already exist." });
          }
        });
    } else {
      await postMstBusiness
        .find({ email: req?.body?.email })
        .then((emailExist) => {
          if (emailExist?.length === 0) {
            postMstBusiness
              .find({ mobile1: req?.body?.mobile1 })
              .then((MobileExist) => {
                if (MobileExist.length === 0) {
                  addMstBusiness(req, res);
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

const addMstBusiness = async (req, res) => {
  try {
    const mstBusiness = req.body;
    const getBranchCity = await postMstBranch.findOne({
      city_id: new mongoose.Types.ObjectId(mstBusiness?.city),
    });
    const oldCardNo = await postMstBusiness.find({}).sort({ _id: -1 }).limit(1);
    mstBusiness.role_id = 2;
    const date = new Date();
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1;
    var monthConcat = "0" + month;
    var year = date.getFullYear().toString().split("0")[1];
    let number = "";
    if (oldCardNo.length === "0" || oldCardNo.length === 0) {
      number = "1";
    } else {
      number = parseInt(oldCardNo?.[0]?.card_no) + 1;
    }
    if (number <= 9) {
      number = "00000" + number;
    } else if (number >= 10 && number <= 99) {
      number = "0000" + number;
    } else if (number >= 100 && number <= 999) {
      number = "000" + number;
    } else if (number >= 1000 && number <= 9999) {
      number = "00" + number;
    } else if (number >= 10000 && number <= 99999) {
      number = "0" + number;
    }
    mstBusiness.card_date = day + "" + monthConcat + "" + year;
    mstBusiness.card_no = number;
    mstBusiness.branch_id = getBranchCity?._id;
    const planData = await postMstPlan.findOne(
      { plan_amount: 0 },
      { _id: 1, plan_validity: 1 }
    );
    mstBusiness.plan_id = planData?._id || null;
    mstBusiness.status = req?.body?.status || 1;
    mstBusiness.entry_date = new Date();
    mstBusiness.update_date = null;
    mstBusiness.update_by = null;
    mstBusiness.qr_code_img = null;
    /* start expiry date logic */
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const entryDateObj = new Date(mstBusiness?.entry_date);
    const expirationDate = new Date(
      entryDateObj.getTime() + planData?.plan_validity * oneDayInMilliseconds
    );
    mstBusiness.plan_expiry_date = expirationDate.toISOString();
    /* End expiry date logic */
    mstBusiness.role = req?.body?.role || 2;
    mstBusiness.main_image = req?.file?.filename || "no image";
    mstBusiness.role =
      decodeToken?.RoleId(req?.headers["authorization"]) || "2";
    if (mstBusiness.role == "1") {
      mstBusiness.entry_by = decodeToken?.fetchId(
        req?.headers["authorization"]
      );
      mstBusiness.role = "2";
      // lastFourDigitsM = mstBusiness.mobile1.substr(
      //   mstBusiness.mobile1.length - 4
      // );
      // mstBusiness.password = year + "@@" + lastFourDigitsM;
    } else {
      mstBusiness.entry_by = null;
      mstBusiness.password = req?.body?.password;
    }
    // const newFolderName = mstBusiness.name + "_" + Date.now();
    // const newFolderPath = path.join(
    //   __dirname,
    //   config.BUSINESS_PATH,
    //   newFolderName
    // );
    // fs.mkdirSync(newFolderPath, { recursive: true });
    /* check mobile no and email id already exist or not */
    const newBusiness = new postMstBusiness(mstBusiness);
    newBusiness.save();
    if (newBusiness?._id) {
      genreateQRCode(req, res, newBusiness);
    }
  } catch (error) {
    console.log(error);
  }
};

const genreateQRCode = async (req, res, newBusiness) => {
  try {
    const mstBusiness = req.body;
    let Encoded_Id = Buffer.from(newBusiness?._id).toString("base64");
    // ${req?.body?.api_url}
    const path = `https://pointsman.in/business_detail?bid=${Encoded_Id}`;
    const filename = Date.now() + req?.body?.name + ".png";
    mstBusiness.qr_code_img = filename;
    QRCode.toFile(
      `businessQRcodeImg/${filename}`,
      path,
      {
        errorCorrectionLevel: "H",
        type: "png",
        margin: 2,
      },
      (err) => {
        if (err) throw err;
        // console.log("QR code generated successfully!");
      }
    );
    // update code for business qr code
    const updateQrCodeImg = async () => {
      const data = await postMstBusiness.findByIdAndUpdate(
        newBusiness?._id,
        { qr_code_img: mstBusiness?.qr_code_img },
        { new: true }
      );
      if (data === null) {
        await postMstBusiness.findByIdAndUpdate(
          newBusiness?._id,
          { qr_code_img: mstBusiness?.qr_code_img },
          { new: true }
        );
      }
      res.status(200).json("Business has been inserted");
    };
    updateQrCodeImg();
  } catch (error) {
    console.log(error);
  }
};

const updateMstBusiness = async (req, res) => {
  try {
    let business_id = req?.params?.id;
    if (decodeToken?.fetchId(req?.params?.id)) {
      business_id = mongoose.Types.ObjectId.createFromHexString(decodeToken?.fetchId(req?.params?.id));
    }
    const getMstBusinessData = await postMstBusiness.findById({ _id: business_id });
    const mstBusiness = req.body;
    mstBusiness.role_id = 2;
    mstBusiness.update_date = new Date();
    mstBusiness.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    mstBusiness.main_image = req?.file?.filename || getMstBusinessData?.main_image;
    mstBusiness.password = getMstBusinessData?.password;
    if (req?.file?.filename !== undefined) {
      fs.unlink(`./businessGallary/${getMstBusinessData?.main_image}`,async (err) => {
          if (err) {
            return res.status(200).json(err);
          } else {
            await postMstBusiness.updateOne({ _id: business_id }, mstBusiness);
            res.status(200).json("Business has been updated");
          }
        }
      );
    } else {
      await postMstBusiness.updateOne({ _id: business_id }, mstBusiness);
      res.status(200).json("Business has been updated");
    }
  } catch (error) {
    console.log(error);
  }
};

const statusUpdateMstBusiness = async (req, res) => {
  try {
    const mstBusiness = req.body;
    mstBusiness.role_id = 2;
    mstBusiness.update_date = new Date();
    mstBusiness.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    await postMstBusiness.updateOne({ _id: req?.params?.id }, mstBusiness);
    res.status(200).json("Business has been updated");
  } catch (error) {
    console.log(error);
  }
};

const deleteMstBusiness = async (req, res) => {
  try {
    await postBusinessFacilities
      .find({ business_id: req?.params?.id })
      .then(async (businessFacilitiesData) => {
        if (
          businessFacilitiesData.length === 0 ||
          businessFacilitiesData.length === "0"
        ) {
          await postBusinessSlider.find({ business_id: req?.params?.id }).then(async (businessSliderData) => {
              if (businessSliderData.length === 0 || businessSliderData.length === "0") {
                await postBusinessTime.find({ business_id: req?.params?.id }).then(async (businessTimeData) => {
                    if (businessTimeData.length === 0 || businessTimeData.length === "0") {
                      const getMstBusinessData = await postMstBusiness.findById({ _id: req?.params?.id });
                      if(getMstBusinessData?.main_image){
                        fs.unlink(`./businessGallary/${getMstBusinessData?.main_image}`, async(err)=>{
                          if(err){
                            return res.status(200).json(err)
                          } else {
                            if(getMstBusinessData?.qr_code_img){
                              fs.unlink(`./businessQRcodeImg/${getMstBusinessData?.qr_code_img}`, async(err)=>{
                                if(err) {
                                  return res.status(200).json(err)
                                } else {
                                  await postMstBusiness.deleteOne({ _id: req?.params?.id });
                                  res.status(200).json("Business has been deleted");
                                }
                              })
                            }
                          }
                        })
                      }
                    } else {
                      res.status(200).json({
                        msg: "Business can not be delete because it is use somewhere else...",
                      });
                    }
                  });
              } else {
                res.status(200).json({
                  msg: "Business can not be delete because it is use somewhere else...",
                });
              }
            });
        } else {
          res.status(200).json({
            msg: "Business can not be delete because it is use somewhere else...",
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

const getBusinessJoin = async (req, res) => {
  try {
    let role = decodeToken?.RoleId(req?.headers["authorization"]);
    let businessJoin = "";
    if (role > 3) {
      const accessId = await accessRights?.rightsAccessData(
        decodeToken?.fetchId(req?.headers["authorization"])
      );
      businessJoin = await postMstBusiness.aggregate([
        {
          $match: { city: accessId },
        },
        {
          $lookup: {
            from: "mst_categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category_data",
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
            from: "states",
            localField: "state",
            foreignField: "_id",
            as: "state_data",
          },
        },
      ]);
    } else {
      businessJoin = await postMstBusiness.aggregate([
        {
          $lookup: {
            from: "mst_categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category_data",
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
            from: "states",
            localField: "state",
            foreignField: "_id",
            as: "state_data",
          },
        },
      ]);
    }
    res.status(200).json(businessJoin);
  } catch (error) {
    console.log(error);
  }
};

const businessJoinDataFrontSide = async (req, res) => {
  try {
    const data = await postMstBusiness.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(req?.params?.id),
        },
      },
      {
        $lookup: {
          from: "mst_categories",
          localField: "category_id",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $unwind: "$categories",
      },
      {
        $addFields: {
          title: "$categories.title", // Add the "title" field from the "categories" sub-document
        },
      },
      {
        $project: {
          password: 0, // Exclude the "password" field from the output
          categories: 0,
        },
      },
    ]);
    return res.status(200).json(...data);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  frontPublicSearchFilter,
  frontPublicMstBusiness,
  frontPublicByIdMstBusiness,
  getBusinessWiseCategory,
  getFilterBusiness,
  getBusinessName,
  getMstBusiness,
  getBusinessProfile,
  getByIdMstBusiness,
  businessJoinDataFrontSide,
  frontSideBusinessRegistration,
  businessExist,
  addMstBusiness,
  updateMstBusiness,
  statusUpdateMstBusiness,
  deleteMstBusiness,
  getBusinessJoin,
};
