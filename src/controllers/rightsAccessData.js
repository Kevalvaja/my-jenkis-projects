const postEmployee = require("../models/m_employee.js");

const rightsAccessData = async (userId) => {
  try {
    const empWiseBranchCityId = await postEmployee.find({ _id: userId },{ branch_id: 1 }).populate({path: "branch_id", select: "city_id"});
    console.log("emp=>>", empWiseBranchCityId?.[0]?.branch_id?.city_id);
    return empWiseBranchCityId?.[0]?.branch_id?.city_id
  } catch (error) {
    console.log(error);
  }
};

module.exports = { rightsAccessData };
