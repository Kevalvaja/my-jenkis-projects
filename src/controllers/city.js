const postCity = require("../models/m_city.js");
const postMstBusiness = require("../models/m_mst_business.js");
const postMstBranch = require("../models/m_mst_branch.js");
const postEmployee = require("../models/m_city.js");
const postCustomer = require("../models/m_customer.js");
const decodeToken = require("./decodeToken.js");
const accessRights = require("./rightsAccessData.js")

const getCity = async (req, res) => {
  try {
    let city = "";
    if (!req?.query?.active) {
      city = await postCity.find({ status: 1 }).sort({city_name: 1});
    } else {
      city = await postCity.find().sort({city_name: 1});
    }
    res.status(200).json(city);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdCity = async (req, res) => {
  try {
    const city = await postCity.findById({ _id: req.params.id });
    res.status(200).json(city);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBranchCity = async (req, res) => {
  try {
    const getCityId = await accessRights.rightsAccessData(decodeToken?.fetchId(req?.params?.id))
    const city = await postCity.find({ _id: getCityId });
    res.status(200).json(city);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const existCity = async (req, res) => {
  try {
    if (req?.params?.id) {
      await postCity
        .find({
          _id: { $ne: req?.params?.id },
          state_id: req?.body?.state_id,
          city_name: req?.body?.city_name,
        })
        .then((existCityName) => {
          if (existCityName?.length === 0) {
            updateCity(req, res);
          } else {
            res.status(200).json({ msg: "City name is already exist" });
          }
        });
    } else {
      await postCity
        .find({
          state_id: req?.body?.state_id,
          city_name: req?.body?.city_name,
        })
        .then((existCityName) => {
          if (existCityName?.length == 0) {
            addCity(req, res);
          } else {
            res.status(200).json({ msg: "City name is already exist" });
          }
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addCity = async (req, res) => {
  try {
    const city = req.body;
    city.status = req?.body?.status || 1;
    city.entry_date = new Date();
    city.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    city.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    city.update_date = null;
    city.update_by = null;
    const newCity = new postCity(city);
    newCity.save();
    res.status(200).json("City has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCity = async (req, res) => {
  try {
    const newCity = req.body;
    newCity.update_date = new Date();
    newCity.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    newCity.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    newCity.status = req?.body?.status || 1;
    await postCity.updateOne({ _id: req.params.id }, newCity);
    res.status(200).json("City has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCity = async (req, res) => {
  try {
    await postMstBusiness
      .find({ city: req?.params?.id })
      .then(async (existMstBusinessCity) => {
        if (
          existMstBusinessCity.length === 0 ||
          existMstBusinessCity.length === "0"
        ) {
          await postMstBranch
            .find({ city_id: req?.params?.id })
            .then(async (existMstBranchCity) => {
              if (
                existMstBranchCity.length === 0 ||
                existMstBranchCity.length === "0"
              ) {
                await postEmployee
                  .find({ city: req?.params?.id })
                  .then(async (existEmployeeCity) => {
                    if (
                      existEmployeeCity.length === 0 ||
                      existEmployeeCity.length === "0"
                    ) {
                      await postCustomer
                        .find({ city: req?.params?.id })
                        .then(async (existCustomerCity) => {
                          if (
                            existCustomerCity.length === 0 ||
                            existCustomerCity.length === "0"
                          ) {
                            await postCity.deleteOne({ _id: req.params.id });
                            res.status(200).json("City has been deleted");
                          } else {
                            res
                              .status(200)
                              .json({
                                msg: "City can not be delete because it is use somewhere else...",
                              });
                          }
                        });
                    } else {
                      res
                        .status(200)
                        .json({
                          msg: "City can not be delete because it is use somewhere else...",
                        });
                    }
                  });
              } else {
                res
                  .status(200)
                  .json({
                    msg: "City can not be delete because it is use somewhere else...",
                  });
              }
            });
        } else {
          res
            .status(200)
            .json({
              msg: "City can not be delete because it is use somewhere else...",
            });
        }
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCityJoinData = async (req, res) => {
  try {
    const cityJoin = await postCity.aggregate([
      {
        $lookup: {
          from: "states",
          localField: "state_id",
          foreignField: "_id",
          as: "state_data",
        },
      },
    ]);
    res.status(200).json(cityJoin);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCity,
  getByIdCity,
  getBranchCity,
  existCity,
  addCity,
  updateCity,
  deleteCity,
  getCityJoinData,
};
