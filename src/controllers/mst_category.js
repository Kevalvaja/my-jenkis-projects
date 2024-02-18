const postMstCategory = require("../models/m_mst_category.js");
const postCategorySlider = require("../models/m_category_slider.js");
const postMstBusiness = require("../models/m_mst_business.js");
const decodeToken = require("./decodeToken.js");
const fs = require("fs")
const mongoose = require("mongoose");
const getGroupByCategory = async (req, res) => {
  try {
    const groupCategory = await postMstCategory.aggregate([
      {
        $match: { parent_category: { $ne: null } }, // Use $match stage to filter documents with parent_category equal to null
      },
      {
        $group: {
          _id: "$parent_category",
          categories: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "mst_categories",
          localField: "_id",
          foreignField: "_id",
          as: "parent_categories",
        },
      },
      {
        $unwind: "$parent_categories",
      },
      {
        $addFields: {
          parent_category_name: "$parent_categories.title",
        },
      },
      {
        $project: {
          parent_categories: 0,
        },
      },
      {
        $sort: {
          parent_category_name: 1, // 1 for ascending order, -1 for descending order
          title: 1,
        },
      },
    ]);
    res.status(200).json(groupCategory);
  } catch (error) {
    console.log(error);
  }
};

const getMstCategory = async (req, res) => {
  try {
    let mstCategory = "";
    if (!req?.query?.active) {
      mstCategory = await postMstCategory.find({ status: 1 }).sort({ title: 1 });
    } else {
      mstCategory = await postMstCategory.find().sort({ title: 1 });
    }
    res.status(200).json(mstCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFrontBusinessSingup = async (req, res) => {
  try {
    const mstCategory = await postMstCategory
      .find({ parent_category: null, status: 1 })
      .sort({ title: 1 });
    res.status(200).json(mstCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdMstCategory = async (req, res) => {
  try {
    const mstCategory = await postMstCategory.findById({ _id: req.params.id });
    res.status(200).json(mstCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const exitMstCategory = async (req, res) => {
  if (req?.params?.id) {
    if (req?.body?.parent_category) {
      const parentCategoryName = await postMstCategory.find({ _id: req?.body?.parent_category }).select("title");
      if (parentCategoryName?.[0]?.title !== req?.body?.title) {
        await postMstCategory.find({ _id: { $ne: req?.params?.id }, title: req?.body?.title }).then((data) => {
            if (data?.length == 0) {
              updateMstCategory(req, res);
            } else {
              return res.status(200).json({ msg: "Category already exist" });
            }
          });
      } else {
        return res.status(200).json({ msg: "Parent category and sub category is same" });
      }
    } else {
      await postMstCategory.find({ _id: { $ne: req?.params?.id }, title: req?.body?.title }).then((data) => {
          if (data?.length == 0) {
            updateMstCategory(req, res);
          } else {
            return res.status(200).json({ msg: "Category already exist" });
          }
        });
    }
  } else {
    await postMstCategory.find({ title: req?.body?.title }).then((data) => {
      if (data?.length == 0) {
        addMstCategory(req, res);
      } else {
        return res.status(200).json({ msg: "Category already exist" });
      }
    });
  }
};

const addMstCategory = async (req, res) => {
  try {
    const mstCategory = req.body;
    mstCategory.status = req?.body?.status || 1;
    mstCategory.parent_category = req?.body?.parent_category || null;
    mstCategory.entry_date = new Date();
    mstCategory.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    mstCategory.role =
      decodeToken?.RoleId(req?.headers["authorization"]) || null;
    mstCategory.update_date = null;
    mstCategory.update_by = null;
    mstCategory.image = req?.file?.filename || "no image";
    const newMstCategory = new postMstCategory(mstCategory);
    await newMstCategory.save();
    res.status(200).json("Category has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMstCategory = async (req, res) => {
  try {
    const getMstCategoruData = await postMstCategory.findById({_id: req.params.id});
    const mstCategory = req.body;
    mstCategory.parent_category = req?.body?.parent_category || null;
    mstCategory.update_date = new Date();
    mstCategory.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    mstCategory.role = decodeToken?.RoleId(req?.headers["authorization"]) || null;
    mstCategory.image = req?.file?.filename || getMstCategoruData?.image;
    if(req?.file?.filename !== undefined) {
      fs.unlink(`./businessGallary/${getMstCategoruData?.image}`,async(err)=>{
        if(err){
          return res.status(400).json(err)
        } else {
          await postMstCategory.updateOne({ _id: req?.params?.id }, mstCategory);
          res.status(200).json("Category has been updated");
        }
      })
    } else {
      await postMstCategory.updateOne({ _id: req?.params?.id }, mstCategory);
      res.status(200).json("Category has been updated");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMstCategory = async (req, res) => {
  try {
    await postMstCategory.find({ parent_category: req?.params?.id }).then((mstCategoryData) => {
        if (mstCategoryData.length === 0 || mstCategoryData.length === "0") {
          postCategorySlider.find({ category_id: req?.params?.id }).then((categorySliderData) => {
              if (categorySliderData.length === 0 || categorySliderData.length === "0") {
                postMstBusiness.find({ category_id: req?.params?.id }).then((mstBusinessrData) => {
                    if (mstBusinessrData.length === 0 || mstBusinessrData.length === "0") {
                      const deleteFunction = async () => {
                        const getMstCategoryData = await postMstCategory.findById({_id: req?.params?.id});
                        if(getMstCategoryData?.image) {
                          fs.unlink(`./businessGallary/${getMstCategoryData?.image}`, async(err)=>{
                            if(err){
                              return res.status(200).json(err)
                            } else {
                              await postMstCategory.deleteOne({ _id: req?.params?.id });
                              res.status(200).json("Category has been deleted");
                            }
                          })
                        }
                      };
                      deleteFunction();
                    } else {
                      res.status(200).json({msg: "Category can not be delete because it is use somewhere else..."});
                    }
                  });
              } else {
                res.status(200).json({msg: "Category can not be delete because it is use somewhere else..."});
              }
            });
        } else {
          res.status(200).json({
            msg: "Category can not be delete because it is use somewhere else...",
          });
        }
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategorySelfJoinData = async (req, res) => {
  try {
    const categorySelfJoin = await postMstCategory.aggregate([
      {
        $lookup: {
          from: "mst_categories",
          localField: "parent_category",
          foreignField: "_id",
          as: "categorySelf_data",
        },
      },
    ]);
    res.status(200).json(categorySelfJoin);
  } catch (error) {
    console.log(error);
  }
};

const updateMstCategoryStatus = async (req, res) => {
  try {
    const MstCategory = req.body;
    (MstCategory.update_date = new Date()),
      (MstCategory.status = req?.body?.status),
      (MstCategory.update_by = decodeToken?.fetchId(
        req?.headers["authorization"]
      ));
    await postMstCategory.updateOne({ _id: req.params.id }, MstCategory);
    res.status(200).json("Category has been deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getGroupByCategory,
  getMstCategory,
  getFrontBusinessSingup,
  getByIdMstCategory,
  exitMstCategory,
  addMstCategory,
  updateMstCategory,
  deleteMstCategory,
  getCategorySelfJoinData,
  updateMstCategoryStatus,
};
