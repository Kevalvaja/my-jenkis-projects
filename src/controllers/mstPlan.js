const postMstPlan = require("../models/m_mstPlan.js");
const postMstBusiness = require("../models/m_mst_business.js");
const decodeToken = require("./decodeToken.js");
const fs = require("fs")
const getMstPlan = async (req, res) => {
  try {
    let mstPlan = "";
    if (!req?.query?.active) {
      mstPlan = await postMstPlan.find({ status: 1 });
    } else {
      mstPlan = await postMstPlan.find();
    }
    res.status(200).json(mstPlan);
  } catch (error) {
    console.log(error);
  }
};

const getByIdMstPlan = async (req, res) => {
  try {
    const mstPlanData = await postMstPlan.findById({ _id: req.params.id });
    res.status(200).json(mstPlanData);
  } catch (error) {
    console.log(error);
  }
};

const existPlan = async (req, res) => {
  try {
    if (req?.params?.id) {
      await postMstPlan
        .find({
          _id: { $ne: req?.params?.id },
          plan_name: req?.body?.plan_name,
          plan_validity: req?.body?.plan_validity,
        })
        .then((existPlan) => {
          if (existPlan.length === 0) {
            updateMstPlan(req, res);
          } else {
            res.status(200).json({ msg: "Plan is already exist" });
          }
        });
    } else {
      await postMstPlan
        .find(
          {
            plan_name: req?.body?.plan_name,
            plan_validity: req?.body?.plan_validity,
          }
          //   {$or: [
          //   { plan_name: req?.body?.plan_name },
          //   { plan_validity: req?.body?.plan_validity }
          // ]}
        )
        .then((existPlan) => {
          if (existPlan.length === 0) {
            addMstPlan(req, res);
          } else {
            res.status(200).json({ msg: "Plan is already exist" });
          }
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const addMstPlan = async (req, res) => {
  try {
    const planData = req.body;
    planData.status = req?.body?.status || 1;
    planData.entry_date = new Date();
    planData.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    planData.role = decodeToken?.RoleId(req?.headers["authorization"]) || "0";
    planData.update_date = null;
    planData.update_by = null;
    planData.plan_front_image =
      req?.files?.["plan_front_image"][0]?.filename || "no image";
    planData.plan_back_image =
      req?.files?.["plan_back_image"][0]?.filename || "no image";
    const newPlanData = new postMstPlan(planData);
    newPlanData.save();
    res.status(200).json("Plan has been inserted");
  } catch (error) {
    console.log(error);
  }
};

const updateMstPlan = async (req, res) => {
  try {
    const getMstPlanData = await postMstPlan.findById({ _id: req?.params?.id });
    const mstPlan = req.body;
    mstPlan.update_date = new Date();
    mstPlan.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    mstPlan.role = decodeToken?.RoleId(req?.headers["authorization"]) || "0";
    mstPlan.plan_front_image = req?.files ? req?.files["plan_front_image"] && req?.files["plan_front_image"][0]?.filename : getMstPlanData?.plan_front_image;
    mstPlan.plan_back_image = req?.files ? req?.files["plan_back_image"] && req?.files["plan_back_image"][0]?.filename
      : getMstPlanData?.plan_back_image;

      if(req?.files["plan_front_image"] !== undefined || req?.files["plan_back_image"] !== undefined) {
        if(req?.files["plan_front_image"] !== undefined) {
          fs.unlink(`./businessGallary/${getMstPlanData?.plan_front_image}`, async(err)=>{
            if(err){
              return res.status(200).json(err)
            } else {
              await postMstPlan.updateOne({ _id: req?.params?.id }, mstPlan);
              res.status(200).json("Plan has been updated");
            }
          })
        }
        if(req?.files["plan_back_image"] !== undefined) {
          fs.unlink(`./businessGallary/${getMstPlanData?.plan_back_image}`, async(err)=>{
            if(err) {
              return res.status(200).json(err)
            } else {
              await postMstPlan.updateOne({ _id: req?.params?.id }, mstPlan);
              res.status(200).json("Plan has been updated");
            }
          })
        }
      } else {
        await postMstPlan.updateOne({ _id: req?.params?.id }, mstPlan);
        res.status(200).json("Plan has been updated");
      }
  } catch (error) {
    console.log(error);
  }
};

const deleteMstPlan = async (req, res) => {
  try {
    await postMstBusiness.find({ plan_id: req?.params?.id }).then((ExistPlan) => {
        if (ExistPlan.length === 0 || ExistPlan.length === "0") {
          const deleteFunction = async () => {
            const getMstPlanData = await postMstPlan.findById({ _id: req?.params?.id });
            if(getMstPlanData?.plan_front_image && getMstPlanData?.plan_back_image) {
              if(getMstPlanData?.plan_front_image) {
                fs.unlink(`./businessGallary/${getMstPlanData?.plan_front_image}`, async(err)=>{
                  if(err){
                    return res.status(200).json(err)
                  } else {
                    if(getMstPlanData?.plan_back_image) {
                      fs.unlink(`./businessGallary/${getMstPlanData?.plan_back_image}`, async(err)=>{
                        if(err) {
                          return res.status(200).json(err)
                        } else {
                          await postMstPlan.deleteOne({ _id: req?.params?.id });
                          res.status(200).json("Plan has been deleted");
                        }
                      })
                    }
                  }
                })
              }
            } 
          };
          deleteFunction();
        } else {
          res.status(200).json({msg: "Plan can not be delete because it is use somewhere else..."});
        }
      });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getMstPlan,
  getByIdMstPlan,
  existPlan,
  addMstPlan,
  updateMstPlan,
  deleteMstPlan,
};
