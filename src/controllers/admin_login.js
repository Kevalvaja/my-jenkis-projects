const postAdmin = require("../models/m_admin.js");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    await postAdmin.find({$or:[{email_id: req.query.loginString},{mobile_no: req.query.loginString}]}).exec().then((userData) => {
        if (userData.length < 1) {
          return res.status(200).json({ msg: "Invalid Email Id / Mobile no" });
        }
        if (userData[0].password == req.query.password) {
          if (userData[0].role_id == req.query.role) {
            if(userData[0].status == 1){
              const token = jwt.sign({ user_id: userData[0]?._id, role: userData[0]?.role_id },process.env.SECRETE);
              return res.status(200).json({ data: token });
            } else {
              return res.status(200).json({ msg: "Your account has been Inactiveted Please contact your admin" });
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
    await postAdmin.find({mobile_no: req.params.id}).exec().then((userData) => {
      if(userData.length > 0) {
        if(userData[0]?.role_id == req?.query?.role){
          return res.status(200).json({ data: 1 })
        } else {
          return res.status(200).json({msg: "Selected role is invalid"})
        }
      } else {
        return res.status(200).json({msg: "Your mobile number is not exist"})
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const forgetPsw = async (req, res) => {
  try {
    const adminData = req?.body;
    adminData.update_date = new Date();
    adminData.update_by = null;
    adminData.role = 1;
    await postAdmin.updateOne({ mobile_no: req.params.id }, adminData)
    res.status(200).json("Your password changed sucessfully..");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { adminLogin, checkMobileno, forgetPsw };
