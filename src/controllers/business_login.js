const postMstBusiness = require("../models/m_mst_business.js");
const decodeToken = require("./decodeToken.js")
const jwt = require("jsonwebtoken");

const businessLogin = async (req, res) => {
  try {
    await postMstBusiness
      .find({
        $or: [
          { email: req?.query?.loginString },
          { mobile1: req?.query?.loginString },
        ],
      })
      .exec()
      .then((userData) => {
        if (userData.length < 1) {
          return res.status(200).json({ msg: "Invalid Email Id / Mobile no" });
        }
        if (userData[0].password == req?.query?.password) {
          if (userData[0].role_id == req?.query?.role) {
            if (userData?.[0]?.status == 1) {
              const token = jwt.sign({ user_id: userData[0]._id, role: userData[0].role_id },process.env.SECRETE);
              return res.status(200).json({ data: token });
            } else {
              return res.status(200).json({ msg: "Your account has been Inactiveted please contact your admin" });
            }
          } else {
            return res.status(200).json({ msg: "Selected Role is Invalid" });  
          }
        } else {
          return res.status(200).json({ msg: "Invalid Password" });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

const checkMobileno = async (req, res) => {
  try {
    await postMstBusiness.find({ mobile1: req?.params?.id }).then((data) => {
      if (data.length === 1) {
        res.status(200).json({ data: 1 });
      } else {
        res.status(200).json({ msg: "Your mobile number is not exist" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const forgetPsw = async (req, res) => {
  try {
    const mstBusinessData = req?.body;
    mstBusinessData.update_date = new Date();
    mstBusinessData.update_by = null;
    mstBusinessData.role = 2;
    await postMstBusiness.updateOne({ mobile1: req.params.id }, mstBusinessData)
    res.status(200).json("Your password changed sucessfully..");
  } catch (error) {
    console.log(error);
  }
};

const changesPassword = async (req, res) => {
  try {
    const getOldPassword = await postMstBusiness.findById({ _id: decodeToken.fetchId(req?.params?.id) })
    const business_password = req.body;
    business_password.update_date = new Date();
    business_password.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    business_password.role = decodeToken?.RoleId(req?.headers["authorization"]);
    if (getOldPassword?.password === req?.body?.old_password) {
      await postMstBusiness.updateOne({ _id: decodeToken.fetchId(req?.params?.id) }, business_password);
      res.status(200).json("Change password successfully");
    } else {
      res.status(200).json({msg: "Incorrect Old Password"});
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { businessLogin, checkMobileno, forgetPsw, changesPassword };
