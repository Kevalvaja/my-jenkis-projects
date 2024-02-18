const postState = require("../models/m_state.js");
const postMstBusiness = require("../models/m_mst_business.js");
const postCity = require("../models/m_city.js");
const postCustomer = require("../models/m_customer.js")
const decodeToken = require("./decodeToken.js");

const getState = async (req, res) => {
  try {
    let state = ""
    if(!req?.query?.active){
      state = await postState.find({status: 1});
    } else {
      state = await postState.find();
    }
    res.status(200).json(state);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdState = async (req, res) => {
  try {
    const state = await postState.findById({ _id: req.params.id });
    res.status(200).json(state);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const stateExist = async (req, res) => {
  try {
    if(req?.params?.id){
      await postState.find({ _id: {$ne: req?.params?.id}, state_name: req?.body?.state_name }).then((existStateName) => {
          if (existStateName.length === 0) {
            updateState(req, res);
          } else {
            res.status(200).json({ msg: "State name is already exist" });
          }
        });
    } else {
      await postState.find({ state_name: req?.body?.state_name }).then((existStateName) => {
        if (existStateName.length === 0) {
          addState(req, res);
        } else {
          res.status(200).json({ msg: "State name is already exist" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addState = async (req, res) => {
  try {
    const state = req.body;
    state.status = req?.body?.status || 1;
    state.entry_date = new Date();
    state.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    state.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    state.update_date = null;
    state.update_by = null;
    const newState = new postState(state);
    newState.save();
    res.status(200).json("State has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateState = async (req, res) => {
  try {
    const newState = req.body;
    newState.update_date = new Date();
    newState.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    newState.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    await postState.updateOne({ _id: req.params.id }, newState);
    res.status(200).json("State has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteState = async (req, res) => {
  try {
    await postMstBusiness.find({state: req?.params?.id}).then( async (existStateMstBusiness) => {
      if(existStateMstBusiness.length === 0 || existStateMstBusiness.length === "0") {
        await postCity.find({state_id: req?.params?.id}).then( async (existStateCity) => {
          if(existStateCity.length === 0 || existStateCity.length === "0") {
            await postCustomer.find({ state: req?.params?.id }).then( async (existStateCustomer) => {
              if(existStateCustomer.length === 0 || existStateCustomer.length === "0") {
                await postState.deleteOne({ _id: req.params.id });
                res.status(200).json("State has been deleted");
              } else {
                res.status(200).json({msg: "State can not be delete because it is use somewhere else..."})
              } 
            })
          } else {
            res.status(200).json({msg: "State can not be delete because it is use somewhere else..."})
          } 
        })
      } else {
        res.status(200).json({msg: "State can not be delete because it is use somewhere else..."})
      }
    })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getState,
  getByIdState,
  stateExist,
  addState,
  updateState,
  deleteState,
};
