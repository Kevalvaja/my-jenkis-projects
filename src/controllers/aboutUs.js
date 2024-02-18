const postAboutUs = require("../models/m_aboutUs.js");
const decodeToken = require("./decodeToken.js");
const fs = require("fs")
const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await postAboutUs.find();
    res.status(200).json(aboutUs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdAboutUs = async (req, res) => {
  try {
    const aboutUsData = await postAboutUs.findById({ _id: req?.params?.id });
    res.status(200).json(aboutUsData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addAboutUs = async (req, res) => {
  try {
    const aboutUsData = req.body;
    aboutUsData.status = req?.body?.status || 1;
    aboutUsData.entry_date = new Date();
    aboutUsData.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    aboutUsData.role = decodeToken?.RoleId(req?.headers["authorization"]);
    aboutUsData.update_date = null;
    aboutUsData.update_by = null;    
    aboutUsData.about_image = req?.file?.filename || "no image";
    const newAboutUsData = new postAboutUs(aboutUsData);
    newAboutUsData.save();
    res.status(200).json("About Us has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAboutUs = async (req, res) => {
  try {
    const getAboutUsData = await postAboutUs.findById({ _id: req?.params?.id });
    const aboutUsData = req.body;
    aboutUsData.update_date = new Date();
    aboutUsData.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    aboutUsData.role = decodeToken?.RoleId(req?.headers["authorization"]);
    aboutUsData.about_image = req?.file?.filename || getAboutUsData?.about_image;
    if(req?.file?.filename !== undefined){
      fs.unlink(`./businessGallary/${getAboutUsData?.about_image}`, async(err)=>{
        if(err) {
          return res.status(200).json(err)
        } else {
          await postAboutUs.updateOne({ _id: req?.params?.id }, aboutUsData);
          res.status(200).json("About Us has been updated");
        }
      })
    } else {
      await postAboutUs.updateOne({ _id: req?.params?.id }, aboutUsData);
      res.status(200).json("About Us has been updated");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAboutUs = async (req, res) => {
  try {
    await postAboutUs.deleteOne({ _id: req.params.id });
    res.status(200).json("About Us has been deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAboutUs,
  getByIdAboutUs,
  addAboutUs,
  updateAboutUs,
  deleteAboutUs,
};
