const postAdmin = require("../models/m_admin.js");
const postMstCategory = require("../models/m_mst_category.js");
const postMstBusiness = require("../models/m_mst_business.js");
const postBusinessSlider = require("../models/m_business_slider.js");
const postCategorySlider = require("../models/m_category_slider.js");
const postState = require("../models/m_state.js");
const postMstPlan = require("../models/m_mstPlan.js");
const postMstBranch = require("../models/m_mst_branch.js");
const postBusinessFacilities = require("../models/m_business_facilities.js");
const postBusinessTime = require("../models/m_business_time.js");
const postEmployee = require("../models/m_employee.js");
const accessRights = require("./rightsAccessData.js");
const decoedToken = require("./decodeToken.js");
const mongoose = require("mongoose");

const getCountData = async (req, res) => {
  console.log("call function");
  try {
    const role = decoedToken.RoleId(req?.headers["authorization"]);
    if (role == 1) {
      const admin = await postAdmin.countDocuments({});
      const category = await postMstCategory.countDocuments({});
      const business = await postMstBusiness.countDocuments({});
      const businessSlider = await postBusinessSlider.countDocuments({});
      const categorySlider = await postCategorySlider.countDocuments({});
      const state = await postState.countDocuments({});
      const plan = await postMstPlan.countDocuments({});
      const branch = await postMstBranch.countDocuments({});
      const employee = await postEmployee.countDocuments({});
      const businessTime = await postBusinessTime.countDocuments({});
      const businessServices = await postBusinessFacilities.countDocuments({
        type: 1,
      });
      const businessProducts = await postBusinessFacilities.countDocuments({
        type: 2,
      });
      const businessPortfolio = await postBusinessFacilities.countDocuments({
        type: 3,
      });
      return res.status(200).json({
        admin: admin,
        category: category,
        business: business,
        businessSlider: businessSlider,
        categorySlider: categorySlider,
        state: state,
        plan: plan,
        branch: branch,
        employee: employee,
        businessTime: businessTime,
        businessServices: businessServices,
        businessProducts: businessProducts,
        businessPortfolio: businessPortfolio,
      });
    } else if (role == 2) {
      const user_id = decoedToken?.fetchId(req?.headers["authorization"]);
      const businessSlider = await postBusinessSlider.countDocuments({
        business_id: user_id,
      });
      const admin = await postAdmin.countDocuments({
        and: [{ entry_by: user_id }, { role: role }],
      });
      const category = await postMstCategory.countDocuments({
        // $and: [{ entry_by: user_id }, { role: role }],
      });
      const business = await postMstBusiness.countDocuments({
        _id: mongoose.Types.ObjectId.createFromHexString(user_id),
      });
      const categorySlider = await postCategorySlider.countDocuments({
        $and: [{ entry_by: user_id }, { role: role }],
      });
      const state = await postState.countDocuments({
        // $and: [{ entry_by: user_id }, { role: role }],
      });
      const plan = await postMstPlan.countDocuments({
        $and: [{ entry_by: user_id }, { role: role }],
      });
      const branch = await postMstBranch.countDocuments({
        $and: [{ entry_by: user_id }, { role: role }],
      });
      const businessTime = await postBusinessTime.countDocuments({
        business_id: mongoose.Types.ObjectId.createFromHexString(user_id),
      });
      const businessServices = await postBusinessFacilities.countDocuments({
        business_id: mongoose.Types.ObjectId.createFromHexString(user_id),
        type: 1,
      });
      const businessProducts = await postBusinessFacilities.countDocuments({
        business_id: mongoose.Types.ObjectId.createFromHexString(user_id),
        type: 2,
      });
      const businessPortfolio = await postBusinessFacilities.countDocuments({
        business_id: mongoose.Types.ObjectId.createFromHexString(user_id),
        type: 3,
      });
      return res.status(200).json({
        admin: admin,
        category: category,
        business: business,
        businessSlider: businessSlider,
        categorySlider: categorySlider,
        state: state,
        plan: plan,
        branch: branch,
        businessServices: businessServices,
        businessProducts: businessProducts,
        businessPortfolio: businessPortfolio,
        businessTime: businessTime,
      });
    } else if (role > 3) {
      const user_id = decoedToken?.fetchId(req?.headers["authorization"]);
      const accessId = await accessRights?.rightsAccessData(
        decoedToken?.fetchId(req?.headers["authorization"])
      );
      const businessSlider = await postBusinessSlider.aggregate([
        {
          $lookup: {
            from: "mst_businesses",
            foreignField: "_id",
            localField: "business_id",
            as: "business",
          },
        },
        {
          $unwind: "$business",
        },
        {
          $match: { "business.city": accessId },
        },
        {
          $project: {
            business_id: 1,
            "business.city": 1,
            "business._id": 1,
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);
      const admin = await postAdmin.countDocuments({
        $and: [{ entry_by: user_id }, { role: role }],
      });
      const employeeData = await postEmployee.findById({ _id: user_id})
      const employee = await postEmployee.countDocuments({ branch_id: employeeData?.branch_id })
      const category = await postMstCategory.countDocuments({
        // $and: [{ entry_by: user_id }, { role: role }],
      });
      const business = await postMstBusiness.countDocuments({ city: accessId });
      const categorySlider = await postCategorySlider.countDocuments({
        // $and: [{ entry_by: user_id }, { role: role }],
      });
      const state = await postState.countDocuments({
        // $and: [{ entry_by: user_id }, { role: role }],
      });
      const plan = await postMstPlan.countDocuments({
        // $and: [{ entry_by: user_id }, { role: role }],
      });
      const branch = await postMstBranch.countDocuments({
        // $and: [{ entry_by: user_id }, { role: role }],
      });
      const businessTime = await postBusinessTime.aggregate([
        {
          $lookup: {
            from: "mst_businesses",
            foreignField: "_id",
            localField: "business_id",
            as: "business",
          },
        },
        {
          $unwind: "$business",
        },
        {
          $match: { "business.city": accessId },
        },
        {
          $project: {
            business_id: 1,
            "business.city": 1,
            "business._id": 1,
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);
      const businessServices = await postBusinessFacilities.aggregate([
        {
          $match: { type: 1 },
        },
        {
          $lookup: {
            from: "mst_businesses",
            foreignField: "_id",
            localField: "business_id",
            as: "business",
          },
        },
        {
          $unwind: "$business",
        },
        {
          $match: { "business.city": accessId },
        },
        {
          $project: {
            business_id: 1,
            "business.city": 1,
            "business._id": 1,
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);
      const businessProducts = await postBusinessFacilities.aggregate([
        {
          $match: { type: 2 },
        },
        {
          $lookup: {
            from: "mst_businesses",
            foreignField: "_id",
            localField: "business_id",
            as: "business",
          },
        },
        {
          $unwind: "$business",
        },
        {
          $match: { "business.city": accessId },
        },
        {
          $project: {
            business_id: 1,
            "business.city": 1,
            "business._id": 1,
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);
      const businessPortfolio = await postBusinessFacilities.aggregate([
        {
          $match: { type: 3 },
        },
        {
          $lookup: {
            from: "mst_businesses",
            foreignField: "_id",
            localField: "business_id",
            as: "business",
          },
        },
        {
          $unwind: "$business",
        },
        {
          $match: { "business.city": accessId },
        },
        {
          $project: {
            business_id: 1,
            "business.city": 1,
            "business._id": 1,
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json({
        admin: admin,
        category: category,
        business: business,
        businessSlider: businessSlider?.[0]?.count,
        categorySlider: categorySlider,
        state: state,
        plan: plan,
        branch: branch,
        employee: employee,
        businessTime: businessTime?.[0]?.count,
        businessServices: businessServices?.[0]?.count,
        businessProducts: businessProducts?.[0]?.count,
        businessPortfolio: businessPortfolio?.[0]?.count,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCountData };
