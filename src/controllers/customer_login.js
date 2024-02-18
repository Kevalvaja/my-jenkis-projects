const postCustomer = require("../models/m_customer.js");
const decodeToken = require("./decodeToken.js")
const jwt = require("jsonwebtoken");

const customerLogin = async (req, res) => {
  try {
    await postCustomer.find({ mobile_no: req?.query?.loginString }).exec().then((userData) => {
      if (userData.length < 1) {
        return res.status(200).json({ msg: "Invalid Mobile no" });
      }
      if (userData[0].password == req?.query?.password) {
          // console.log("call function");
          // if (userData[0].role == req?.query?.role) {
            if (userData?.[0]?.status == 1) {
              const token = jwt.sign({ user_id: userData[0]._id, role: userData[0].role_id },process.env.SECRETE);
              return res.status(200).json({ data: token });
            } else {
              return res.status(200).json({msg: "Your account has been Inactiveted please contact your admin"});
            }
          // }
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
    await postCustomer.find({ mobile_no: req?.params?.id }).then((data) => {
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
    const CustomerData = req?.body;
    CustomerData.update_date = new Date();
    CustomerData.update_by = null;
    CustomerData.role = 0;
    await postCustomer.updateOne({ mobile_no: req.params.id }, CustomerData)
    res.status(200).json("Your password changed sucessfully..");
  } catch (error) {
    console.log(error);
  }
};

const changesPassword = async (req, res) => {
  try {
    const getOldPassword = await postCustomer.findById({ _id: decodeToken.fetchId(req?.params?.id) })
    const customer_password = req.body;
    customer_password.update_date = new Date();
    customer_password.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    customer_password.role = decodeToken?.RoleId(req?.headers["authorization"]);
    if (getOldPassword?.password === req?.body?.old_password) {
      await postCustomer.updateOne({ _id: decodeToken.fetchId(req?.params?.id) }, customer_password);
      res.status(200).json("Change password successfully");
    } else {
      res.status(200).json({msg: "Incorrect Old Password"});
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { customerLogin, checkMobileno, forgetPsw, changesPassword };
