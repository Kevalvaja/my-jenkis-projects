const postBusinessFacilities = require("../models/m_business_facilities.js");
const postBusinessFtsImages = require("../models/m_business_facilities_images.js");
const decodeToken = require("./decodeToken.js");
const accessRights = require("./rightsAccessData.js");
const mongoose = require("mongoose");
const fs = require("fs")
const getBusinessFacilitiesFrontSide = async (req, res) => {
  try {
    const businessFacilitiesData = await postBusinessFacilities.aggregate([
      {
        $match: {
          business_id: mongoose.Types.ObjectId.createFromHexString(req?.params?.id),
        status: 1
        },
      },
      {
        $lookup: {
          from: "business_facilities_imgs",
          localField: "_id",
          foreignField: "bus_faclities_id",
          as: "images",
        },
      },
      {
        $sort:{
          title: 1
        }
      }
    ]);
    res.status(200).json(businessFacilitiesData);
  } catch (error) {
    console.log(error);
  }
};

const getBusinessFacilities = async (req, res) => {
  try {
    const businessFacilities = await postBusinessFacilities.find();
    res.status(200).json(businessFacilities);
  } catch (error) {
    console.log(error);
  }
};

const getByIdBusinessFacilities = async (req, res) => {
  try {
    if (req?.params?.id !== "businessFacilitiesImages") {
      const businessFacilities = await postBusinessFacilities.findById({
        _id: req?.params?.id,
      });
      res.status(200).json(businessFacilities);
    }
  } catch (error) {
    console.log(error);
  }
};

const existBusinessFacilitiesData = async (req, res) => {
  try {
    let Role = decodeToken?.RoleId(req?.headers["authorization"]);
    let businessId = req?.body?.business_id;
    if (Role == 2) {
      businessId = decodeToken?.fetchId(req?.headers["authorization"]);
    }
    if (req?.params?.id) {
      await postBusinessFacilities
        .find({
          _id: { $ne: req?.params?.id },
          business_id: businessId,
          title: req?.body?.title,
        })
        .then((data) => {
          if (data.length === 0) {
            updateBusinessFacilities(req, res);
          } else {
            return res
              .status(200)
              .json({ exitMsg: "Business Facilities is already exist" });
          }
        });
    } else {
      await postBusinessFacilities
        .find({ business_id: businessId, title: req?.body?.title })
        .then((data) => {
          if (data.length === 0) {
            addBusinessFacilities(req, res);
          } else {
            return res
              .status(200)
              .json({ exitMsg: "Business Facilities is already exist" });
          }
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const addBusinessFacilities = async (req, res) => {
  try {
    const businessFacilities = req.body;
    businessFacilities.status = req?.body?.status || 1;
    businessFacilities.entry_date = new Date();
    businessFacilities.entry_by = decodeToken?.fetchId(
      req?.headers["authorization"]
    );
    businessFacilities.role =
      decodeToken?.RoleId(req?.headers["authorization"]) || "0";
    if (businessFacilities.role == 2) {
      businessFacilities.business_id = decodeToken?.fetchId(
        req?.headers["authorization"]
      );
    }
    businessFacilities.update_date = null;
    businessFacilities.update_by = null;
    const newBusinessFacilities = new postBusinessFacilities(
      businessFacilities
    );
    await newBusinessFacilities.save();
    /* business facilities images upload code is below */
    const lastInsetedId = newBusinessFacilities._id;
    const businessFacilitiesImg = req.body;
    businessFacilitiesImg.bus_faclities_id = lastInsetedId;
    businessFacilitiesImg.image =
      req?.files?.map((file) => file?.filename);
    for (let i = 0; i < businessFacilitiesImg.image.length; i++) {
      const newBusinessFacilitiesImg = new postBusinessFtsImages({
        ...businessFacilitiesImg,
        image: businessFacilitiesImg.image[i],
      });
      await newBusinessFacilitiesImg.save();
    }
    res.status(200).json("Bussiness facilities has been inserted");
  } catch (error) {
    console.log(error);
  }
};

const updateBusinessFacilities = async (req, res) => {
  try {
    const businessFacilities = req.body;
    businessFacilities.update_date = new Date();
    businessFacilities.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    businessFacilities.role = decodeToken?.RoleId(req?.headers["authorization"]) || "0";
    if (businessFacilities.role == 2) {
      businessFacilities.business_id = decodeToken?.fetchId(req?.headers["authorization"]);
    }
    businessFacilities.bus_faclities_id = req?.params?.id;
    businessFacilities.image = req?.files?.map((file) => file?.filename);
    for (let i = 0; i < businessFacilities.image.length; i++) {
      const newBusinessFacilitiesImg = new postBusinessFtsImages({
        ...businessFacilities,
        image: businessFacilities.image[i],
      });
      await newBusinessFacilitiesImg.save();
    }
    await postBusinessFacilities.updateOne({ _id: req.params.id },businessFacilities);
    res.status(200).json("Business facilities has been updated");
  } catch (error) {
    console.log(error);
  }
};

const deleteBusinessFacilities = async (req, res) => {
  try {
    const ftsImages = await postBusinessFtsImages.find({ bus_faclities_id: req?.params?.id });
    if(ftsImages.length > 0) {      
      for (let i = 0; i < ftsImages.length; i++) {
        fs.unlink(`./businessGallary/${ftsImages?.[i]?.image}`, async(err)=>{
          if(err) {
            return res.status(200).json(err)
          } else {
            console.log("i",i);
            if(i == 0){
              await postBusinessFtsImages.deleteMany({ bus_faclities_id: req?.params?.id });
              await postBusinessFacilities.deleteOne({ _id: req?.params?.id });
              res.status(200).json("Business facilities has been deleted");
            }
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteFImages = async (req, res) => {
  try {
    const ftsImages = await postBusinessFtsImages.findById({ _id: req?.params?.id });
    if(ftsImages?.image){
      fs.unlink(`./businessGallary/${ftsImages?.image}`, async(err)=>{
        if(err) {
          return res.status(200).json(err)
        } else {
          await postBusinessFtsImages.deleteOne({ _id: req?.params?.id });
          res.status(200).json("Facilities image has been deleted");
        }
      })
    }
  } catch (error) {
    console.log(error);
  }
};

const getBusinessFacilitiesJoinData = async (req, res) => {
  try {
    const role = decodeToken?.RoleId(req?.headers["authorization"]);
    let businessFacilitiesJoin = "";
    if (role == 1) {
      businessFacilitiesJoin = await postBusinessFacilities.aggregate([
        {
          $lookup: {
            from: "mst_businesses",
            localField: "business_id",
            foreignField: "_id",
            as: "businessF_data",
          },
        },
        {
          $unwind: "$businessF_data",
        },
      ]);
    } else if (role == 2) {
      businessFacilitiesJoin = await postBusinessFacilities.aggregate([
        {
          $match: {
            business_id: mongoose.Types.ObjectId.createFromHexString(
              decodeToken?.fetchId(req?.headers["authorization"])
            ),
          },
        },
        {
          $lookup: {
            from: "mst_businesses",
            localField: "business_id",
            foreignField: "_id",
            as: "businessF_data",
          },
        },
        {
          $unwind: "$businessF_data",
        },
      ]);
    } else {
      const accessId = await accessRights?.rightsAccessData(
        decodeToken?.fetchId(req?.headers["authorization"])
      );
      businessFacilitiesJoin = await postBusinessFacilities.aggregate([
        {
          $lookup: {
            from: "mst_businesses",
            localField: "business_id",
            foreignField: "_id",
            as: "businessF_data",
          },
        },
        {
          $unwind: "$businessF_data",
        },
        {
          $match: { "businessF_data.city": accessId },
        },
      ]);
    }
    res.status(200).json(businessFacilitiesJoin);
  } catch (error) {
    console.log(error);
  }
};

const getBusinessFacilitiesImages = async (req, res) => {
  try {
    const businessFacilitiesJoin = await postBusinessFtsImages.aggregate([
      {
        $match: {
          bus_faclities_id: mongoose.Types.ObjectId.createFromHexString(
            req?.params?.id
          ),
        },
      },
      {
        $lookup: {
          from: "business_facilities",
          localField: "bus_faclities_id",
          foreignField: "_id",
          as: "businessF_images",
        },
      },
    ]);

    res.status(200).json(businessFacilitiesJoin);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getBusinessFacilitiesFrontSide,
  getBusinessFacilities,
  getByIdBusinessFacilities,
  existBusinessFacilitiesData,
  addBusinessFacilities,
  updateBusinessFacilities,
  deleteBusinessFacilities,
  deleteFImages,
  getBusinessFacilitiesJoinData,
  getBusinessFacilitiesImages,
};
