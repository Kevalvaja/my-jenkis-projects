const { default: mongoose } = require("mongoose");
const postBusinessSlider = require("../models/m_business_slider.js");
const decodeToken = require("./decodeToken.js");
const accessRights = require("./rightsAccessData.js");
const fs = require("fs")
// const postBusinessSliderImages = require("../models/m_business_slider_images.js");

const getBusinessSlider = async (req, res) => {
  try {
    let businessSlider = "";
    if (!req?.query?.active) {
      businessSlider = await postBusinessSlider.find({ status: 1 });
    } else {
      businessSlider = await postBusinessSlider.find();
    }
    res.status(200).json(businessSlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdBusinessSlider = async (req, res) => {
  try {
    if (req?.params?.id === "businessSliderJoinData") {
      const businessSlider = await postBusinessSlider.findById({_id: req.params.id});
      res.status(200).json(businessSlider);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFrontBusinessSlider = async (req, res) => {
  try {
    const businessSlider = await postBusinessSlider.find({
      business_id: req?.params?.id,
      status: 1,
    });
    res.status(200).json(businessSlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addBusinessSlider = async (req, res) => {
  try {
    const businessSlider = req.body;
    businessSlider.status = req?.body?.status || 1;
    businessSlider.entry_date = new Date();
    businessSlider.entry_by = decodeToken?.fetchId(
      req?.headers["authorization"]
    );
    businessSlider.role = decodeToken?.RoleId(req?.headers["authorization"]);
    if (businessSlider.role == 2) {
      businessSlider.business_id = decodeToken?.fetchId(
        req?.headers["authorization"]
      );
    }
    businessSlider.update_date = null;
    businessSlider.update_by = null;
    businessSlider.image =
      req?.files?.map((file) => file?.filename) || "no images";
    for (let i = 0; i < businessSlider.image.length; i++) {
      const newBusinessSlider = new postBusinessSlider({
        ...businessSlider,
        image: businessSlider.image[i],
      });
      await newBusinessSlider.save();
    }
    res.status(200).json("Bussiness slider has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBusinessSlider = async (req, res) => {
  try {
    const businessSider = req.body;
    businessSider.update_date = new Date();
    businessSider.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    businessSider.role = decodeToken?.RoleId(req?.headers["authorization"]);
    if (businessSider.role == 2) {
      businessSider.business_id = decodeToken?.fetchId(req?.headers["authorization"]);
    }
    const upBusinessSliderId = req.params.id;
    businessSider.image = req?.file?.filename || "no image";
    await postBusinessSlider.updateOne({ _id: upBusinessSliderId },businessSider);
    res.status(200).json("Business slider has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBusinessSliderStatus = async (req, res) => {
  try {
    const businessSider = req.body;
    (businessSider.update_date = new Date()),
      (businessSider.update_by = decodeToken?.fetchId(req?.headers["authorization"]));
    businessSider.role = decodeToken?.RoleId(req?.headers["authorization"]);
    (businessSider.status = req.body.status),
      await postBusinessSlider.updateOne({ _id: req.params.id }, businessSider);
    res.status(200).json("Business slider has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBusinessSlider = async (req, res) => {
  try {
    const getBusinessSlider = await postBusinessSlider.findById({ _id: req?.params?.id});
    if(getBusinessSlider?.image){
      fs.unlink(`./businessGallary/${getBusinessSlider?.image}`, async(err)=>{
        if(err) {
          return res.status(200).json(err)
        } else {
          await postBusinessSlider.deleteOne({ _id: req?.params?.id });
          res.status(200).json("Business slider has been deleted");
        }
     })
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBusinessSliderJoinData = async (req, res) => {
  try {
    const role = decodeToken?.RoleId(req?.headers["authorization"]);
    let businessSliderJoin = [];
    if (role == 1) {
      businessSliderJoin = await postBusinessSlider.aggregate([
        {
          $lookup: {
            from: "mst_businesses",
            localField: "business_id",
            foreignField: "_id",
            as: "businessSlider_data",
          },
        },
      ]);
    } else if(role == 2) {
      businessSliderJoin = await postBusinessSlider.aggregate([
        {
          $match: {
            business_id: mongoose.Types.ObjectId.createFromHexString(
              decodeToken?.fetchId(req?.headers["authorization"])
            ),
            // mongoose.Types.ObjectId.createFromHexString(),
          },
        },
        {
          $lookup: {
            from: "mst_businesses",
            localField: "business_id",
            foreignField: "_id",
            as: "businessSlider_data",
          },
        },
      ]);
    } else if(role > 3) {
      const accessId = await accessRights?.rightsAccessData(
        decodeToken?.fetchId(req?.headers["authorization"])
      );
      businessSliderJoin = await postBusinessSlider.aggregate([
        {
          $lookup: {
            from: "mst_businesses",
            localField: "business_id",
            foreignField: "_id",
            as: "businessSlider_data",
          },
        },
        {
          $match: {
            "businessSlider_data.city": accessId,
            "businessSlider_data.status": 1
          },
        },
      ]);
    }
    res.status(200).json(businessSliderJoin);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getBusinessSlider,
  getByIdBusinessSlider,
  getFrontBusinessSlider,
  addBusinessSlider,
  updateBusinessSlider,
  updateBusinessSliderStatus,
  deleteBusinessSlider,
  getBusinessSliderJoinData,
};
