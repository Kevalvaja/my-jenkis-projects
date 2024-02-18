const postRightsMenu = require("../models/m_rights_menu.js");
const decodeToken = require("../controllers/decodeToken.js");
const getRightsMenu = async (req, res) => {
  try {
    const getData = await postRightsMenu.find();
    res.status(200).json(getData);
  } catch (error) {
    console.log(error);
  }
};

const getRightsMenuById = async (req, res) => {
  try {
    const getByIdData = await postRightsMenu.findById({ _id: req?.params?.id });
    res.status(200).json(getByIdData);
  } catch (error) {
    console.log(error);
  }
};

const alreadyExist = async (req, res) => {
  try {
    if(req?.params?.id){
      await postRightsMenu.find({ _id: {$ne:req?.params?.id}, menu_name: req?.body?.menu_name }).then((existData) => {
        if(existData.length === 0){
          updateRightsMenu(req,res);
        } else {
          res.status(200).json({msg: "Rights menu already exist"});
        }
      })
    } else {
      await postRightsMenu.find({ menu_name: req?.body?.menu_name }).then((existData)=>{
        if(existData.length === 0){
          addRightsMenu(req,res);
        } else {
          res.status(200).json({msg: "Rights menu already exist"});
        }
      })
    }
  } catch (error) {
    console.log(error);
  }
};

const addRightsMenu = async (req, res) => {
  try {
    const rightsMenuData = req?.body;
    rightsMenuData.status = req?.body?.status || 1;
    rightsMenuData.entry_date = new Date();
    rightsMenuData.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    rightsMenuData.update_date = null;
    rightsMenuData.update_by = null;    
    const newRightsData = await postRightsMenu(rightsMenuData);
    newRightsData.save();
    res.status(200).json("Rights menu has been inserted");
  } catch (error) {
    console.log(error);
  }
};

const updateRightsMenu = async (req, res) => {
  try {
    const rightsMenuData = req?.body;
    rightsMenuData.status = req?.body?.status || 1;
    rightsMenuData.update_date = new Date();
    rightsMenuData.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    await postRightsMenu.updateOne({ _id: req?.params?.id }, rightsMenuData);
    res.status(200).json("Rights menu has been updated");
  } catch (error) {
    console.log(error);
  }
};

const deleteRightsMenu = async (req, res) => {
  try {
    await postRightsMenu.deleteOne({ _id: req?.params?.id });
    res.status(200).json("Rights menu has been deleted");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getRightsMenu,
  getRightsMenuById,
  alreadyExist,
  addRightsMenu,
  updateRightsMenu,
  deleteRightsMenu,
};
