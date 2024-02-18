const postHomeSlider = require("../models/m_home_slider.js");
const decodeToken = require("./decodeToken.js");
const fs = require("fs")
const getHomeSlider = async (req, res) => {
  try {
    let homeSlider = "";
    if (!req?.query?.active) {
      homeSlider = await postHomeSlider.find({ status: 1 });
    } else {
      homeSlider = await postHomeSlider.find();
    }
    res.status(200).json(homeSlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdHomeSlider = async (req, res) => {
  try {
    const homeSlider = await postHomeSlider.findById({ _id: req.params.id });
    res.status(200).json(homeSlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addHomeSlider = async (req, res) => {
  try {
    const homeSlider = req.body;
    homeSlider.status = req?.body?.status || 1;
    homeSlider.entry_date = new Date();
    homeSlider.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    homeSlider.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    homeSlider.update_date = null;
    homeSlider.update_by = null;
    homeSlider.image = req?.files.map((file) => file?.filename) || "no images";
    for (let i = 0; i < homeSlider.image.length; i++) {
      const newHomeSlider = new postHomeSlider({
        ...homeSlider,
        image: homeSlider.image[i],
      });
      await newHomeSlider.save();
    }
    res.status(200).json("Home slider has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateHomeSlider = async (req, res) => {
  try {
    const homeSlider = req.body;
    homeSlider.update_date = new Date();
    homeSlider.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    homeSlider.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    homeSlider.image = req?.file?.filename || "no image";
    await postHomeSlider.updateOne({ _id: req?.params?.id }, homeSlider);
    res.status(200).json("Home slider has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateHomeSliderStatus = async (req, res) => {
  try {
    const homeSlider = req.body;
    (homeSlider.update_date = new Date()),
      (homeSlider.update_by = decodeToken?.fetchId(
        req?.headers["authorization"]
      ));
    homeSlider.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    (homeSlider.status = req?.body?.status),
      await postHomeSlider.updateOne({ _id: req.params.id }, homeSlider);
    res.status(200).json("Home slider has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteHomeSlider = async (req, res) => {
  try {
    const getHomeSliderSlider = await postHomeSlider.findById({ _id: req?.params?.id});
    if(getHomeSliderSlider?.image){
      fs.unlink(`./businessGallary/${getHomeSliderSlider?.image}`, async(err)=>{
        if(err) {
          return res.status(200).json(err)
        } else {
          await postHomeSlider.deleteOne({ _id: req.params.id });
          res.status(200).json("Home slider has been deleted");
        }
      })
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getHomeSlider,
  getByIdHomeSlider,
  addHomeSlider,
  updateHomeSlider,
  updateHomeSliderStatus,
  deleteHomeSlider,
};
