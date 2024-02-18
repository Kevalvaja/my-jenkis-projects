const { default: mongoose } = require("mongoose");
const postBusinessTime = require("../models/m_business_time.js");
const decodeToken = require("./decodeToken.js");

const getFrontSideBusinessTime = async (req, res) => {
  try {
    const businessTime = await postBusinessTime.find({business_id: req?.params?.id, status: 1});
    res.status(200).json(businessTime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBusinessTime = async (req, res) => {
  try {
    const businessTime = await postBusinessTime.find();
    res.status(200).json(businessTime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdBusinessTime = async (req, res) => {
  try {
    const businessTime = await postBusinessTime.find({
      business_id: req.params.id,
    });
    res.status(200).json(businessTime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const businessTimeExist = async (req,res) => {
  try {
    let role = decodeToken?.RoleId(req?.headers["authorization"]);
    let businessId = req?.body?.business_id;
    if(role == 2){
      businessId = decodeToken?.fetchId(req?.headers["authorization"]);
    }
    // if(req?.body?.business_id) {
    //   await postBusinessTime.find({ business_id: { $ne: req?.body?.business_id }, business_id: req?.body?.business_id }).then((existData)=>{
    //     if(existData.length === 0){
    //       console.log("call functiono");
    //       updateBusinessTime(req,res);
    //     } else {
    //       res.status(200).json({msg: "Selected business Time is already exist"})
    //     }
    //   })
    // } else {
      await postBusinessTime.find({ business_id: businessId }).then((existData)=>{
        if(existData.length === 0){
          addBusinessTime(req,res);
        } else {
          res.status(200).json({msg: "Selected business Time is already exist"})
        }
      })
    // }
  } catch (error) {
    console.log(error);
  }
}

const addBusinessTime = async (req, res) => {
  try {
    const businessTime = req.body;
    businessTime.status = req?.body?.status || 1;
    businessTime.entry_date = new Date();
    businessTime.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    businessTime.role = decodeToken?.RoleId(req?.headers["authorization"]);
    if(businessTime.role == 2){
      businessTime.business_id = decodeToken?.fetchId(req?.headers["authorization"]);
    }
    businessTime.update_date = null;
    businessTime.update_by = null;
    for (let i = 0; i < businessTime?.businessSchedule?.length; i++) {
      (businessTime.day_name = businessTime?.businessSchedule?.[i]?.days || 0),
        (businessTime.open_time =
          businessTime?.businessSchedule?.[i]?.startTime || 0),
        (businessTime.close_time =
          businessTime?.businessSchedule?.[i]?.endTime || 0);
      businessTime.break_open_time =
        businessTime?.businessSchedule?.[i]?.startBreakTime || 0;
      businessTime.break_close_time =
        businessTime?.businessSchedule?.[i]?.endBreakTime || 0;
      const newBusinessTime = new postBusinessTime(businessTime);
      await newBusinessTime.save();
    }
    res.status(200).json("Business times has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBusinessTime = async (req, res) => {
  try {
    const businessTime = req.body;
    businessTime.status = req?.body?.status || 1;
    businessTime.entry_date = new Date();
    businessTime.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    businessTime.role = decodeToken?.RoleId(req?.headers["authorization"]);
    businessTime.update_date = null;
    businessTime.update_by = null;
    await postBusinessTime.deleteMany({
      business_id: businessTime.business_id,
    });
    for (let i = 0; i < businessTime?.businessSchedule?.length; i++) {
      (businessTime.day_name = businessTime?.businessSchedule?.[i]?.days || 0),
        (businessTime.open_time =
          businessTime?.businessSchedule?.[i]?.startTime || 0),
        (businessTime.close_time =
          businessTime?.businessSchedule?.[i]?.endTime || 0);
      businessTime.break_open_time =
        businessTime?.businessSchedule?.[i]?.startBreakTime || 0;
      businessTime.break_close_time =
        businessTime?.businessSchedule?.[i]?.endBreakTime || 0;
      const newBusinessTime = new postBusinessTime(businessTime);
      await newBusinessTime.save();
    }
    res.status(200).json("Business times has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const businessTime = req.body;
    businessTime.update_date = new Date();
    businessTime.update_by = decodeToken?.fetchId(
      req?.headers["authorization"]
    );
    businessTime.role = decodeToken?.RoleId(
      req?.headers["authorization"]
    );
    await postBusinessTime.updateOne({ _id: req?.params?.id }, businessTime);
    res.status(200).json("Business Time Status has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBusinessTime = async (req, res) => {
  try {
    await postBusinessTime.deleteOne({ _id: req.params.id });
    res.status(200).json("Business times has been deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBusinessTimesJoinData = async (req, res) => {
  try {
    const role = decodeToken?.RoleId(req?.headers["authorization"]);
    let businessTimessJoin = [];
    if(role > 3 || role == 1){
      businessTimessJoin = await postBusinessTime.aggregate([
        {
          $lookup: {
            from: "mst_businesses",
            localField: "business_id",
            foreignField: "_id",
            as: "businessTimes_data",
          },
        },
      ]);
    } else {
      businessTimessJoin = await postBusinessTime.aggregate([
        {
          $match: {
            business_id: mongoose.Types.ObjectId.createFromHexString(decodeToken?.fetchId(req?.headers["authorization"])),
          },
        },
        {
          $lookup: {
            from: "mst_businesses",
            localField: "business_id",
            foreignField: "_id",
            as: "businessTimes_data",
          },
        },
      ]);
    }
    res.status(200).json(businessTimessJoin);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getFrontSideBusinessTime,
  getBusinessTime,
  getByIdBusinessTime,
  businessTimeExist,
  addBusinessTime,
  updateBusinessTime,
  updateStatus,
  deleteBusinessTime,
  getBusinessTimesJoinData,
};
