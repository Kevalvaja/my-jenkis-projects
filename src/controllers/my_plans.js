const postMstBusiness = require("../models/m_mst_business.js");
const mongoose = require("mongoose");
const decodeToken = require("./decodeToken.js");

const getMyPlans = async (req, res) => {
  try {
    const myPlansData = await postMstBusiness.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(decodeToken.fetchId(req?.params?.id)),
        },
      },
      {
        $lookup: {
          from: "mst_plans",
          localField: "plan_id",
          foreignField: "_id",
          as: "myPlans",
        },
      },
      {
        $unwind: "$myPlans",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          branch_id: 1,
          category_id: 1,
          plan_id: 1,
          plan_expiry_date: 1,
          card_date: 1,
          card_no: 1,
          address: 1,
          city: 1,
          state: 1,
          mobile1: 1,
          mobile2: 1,
          website: 1,
          email: 1,
          main_image: 1,
          qr_code_img: 1,
          status: 1,
          entry_date: 1,
          entry_by: 1,
          myPlans: 1,
          duration: {
            $ceil: {
              $divide: [
                { $subtract: ["$plan_expiry_date", new Date()] },
                1000 * 60 * 60 * 24, // Milliseconds to days conversion
              ],
            },
          },
        },
      },
    ]);
    res.status(200).json(myPlansData);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getMyPlans };
