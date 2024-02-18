const postCategorySlider = require("../models/m_category_slider.js");
const decodeToken = require("./decodeToken.js");
const fs = require("fs")

const getCategorySlider = async (req, res) => {
  try {
    let categorySlider = "";
    if (!req?.query?.action) {
      categorySlider = await postCategorySlider.find({ status: 1 });
    } else {
      categorySlider = await postCategorySlider.find();
    }
    res.status(200).json(categorySlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdCategorySlider = async (req, res) => {
  try {
    const categorySlider = await postCategorySlider.findById({
      _id: req.params.id,
    });
    res.status(200).json(categorySlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addCategorySlider = async (req, res) => {
  try {
    const categorySlider = req.body;
    categorySlider.status = req?.body?.status || 1;
    categorySlider.entry_date = new Date();
    categorySlider.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    categorySlider.role = decodeToken?.RoleId(req?.headers["authorization"]);
    categorySlider.update_date = null;
    categorySlider.update_by = null;
    categorySlider.image =
      req?.files.map((file) => file?.filename) || "no images";
    for (let i = 0; i < categorySlider.image.length; i++) {
      const newCategorySlider = new postCategorySlider({
        ...categorySlider,
        image: categorySlider.image[i],
      });
      await newCategorySlider.save();
    }
    res.status(200).json("Category slider has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategorySlider = async (req, res) => {
  try {
    const categorySider = req.body;
    categorySider.update_date = new Date();
    categorySider.update_by = decodeToken?.fetchId(
      req?.headers["authorization"]
    );
    categorySider.role = decodeToken?.RoleId(req?.headers["authorization"]);
    const upCategorySliderId = req.params.id;
    categorySider.image = req?.file?.filename || "no image";
    await postCategorySlider.updateOne(
      { _id: upCategorySliderId },
      categorySider
    );
    res.status(200).json("Category slider has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategorySliderStatus = async (req, res) => {
  try {
    const categorySider = req.body;
    (categorySider.update_date = new Date()),
      (categorySider.update_by = decodeToken?.fetchId(
        req?.headers["authorization"]
      ));
    categorySider.role = decodeToken?.RoleId(req?.headers["authorization"]);
    (categorySider.status = req?.body?.status),
      await postCategorySlider.updateOne({ _id: req.params.id }, categorySider);
    res.status(200).json("Category slider has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategorySlider = async (req, res) => {
  try {
    const getCategorySlider = await postCategorySlider.findById({ _id: req?.params?.id});
    if(getCategorySlider?.image){
      fs.unlink(`./businessGallary/${getCategorySlider?.image}`, async(err)=>{
        if(err) {
          return res.status(200).json(err)
        } else {
          await postCategorySlider.deleteOne({ _id: req.params.id });
          res.status(200).json("Category slider has been deleted");
        }
      })
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategorySliderJoinData = async (req, res) => {
  try {
    const categorySliderJoin = await postCategorySlider.aggregate([
      {
        $lookup: {
          from: "mst_categories",
          localField: "category_id",
          foreignField: "_id",
          as: "categorySliders_data",
        },
      },
    ]);
    res.status(200).json(categorySliderJoin);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCategorySlider,
  getByIdCategorySlider,
  addCategorySlider,
  updateCategorySlider,
  deleteCategorySlider,
  getCategorySliderJoinData,
  updateCategorySliderStatus,
};
