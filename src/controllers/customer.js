const postCustomer = require("../models/m_customer.js");
const decodeToken = require("./decodeToken.js");
const accessRights = require("./rightsAccessData.js");
const fs = require("fs")

const getFrontCustomer = async (req, res) => {
  try {
    const customer = await postCustomer
      .findById({
        _id: decodeToken?.fetchId(req?.params?.id),
      }).select("-password");
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    let role = decodeToken?.RoleId(req?.headers["authorization"]);
    let customer = "";
    if (role > 3) {
      const accessId = await accessRights?.rightsAccessData(
        decodeToken?.fetchId(req?.headers["authorization"])
      );
      customer = await postCustomer.find({ city: accessId }).select();
    } else {
      customer = await postCustomer.find();
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdCustomer = async (req, res) => {
  try {
    const customer = await postCustomer.findById({
      _id: decodeToken?.fetchId(req?.params?.id),
    });
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const frontSideCustomerRegistration = async (req, res) => {
  try {
    // await postCustomer.find({ email: req?.query?.email }).then((emailExist) => {
    //     if (emailExist?.length === 0) {
    await postCustomer
      .find({ mobile_no: req?.query?.mobile_no })
      .then((MobileExist) => {
        if (MobileExist.length === 0) {
          res.status(200).json({ data: 1 });
        } else {
          res.status(200).json({ msg: "Mobileno is already exist" });
        }
      });
    // } else {
    //   res.status(200).json({ msg: "Email Id is already exist." });
    // }
    //   });
  } catch (error) {
    console.log(error);
  }
};

const existCustomer = async (req, res) => {
  try {
    let customerId = req?.params?.id;
    if (decodeToken?.fetchId(req?.params?.id)) {
      customerId = decodeToken?.fetchId(req?.params?.id);
    }
    if (req?.params?.id) {
      await postCustomer
        .find({ _id: { $ne: customerId }, mobile_no: req?.body?.mobile_no })
        .then((existCustomerData) => {
          if (existCustomerData?.length === 0) {
            updateCustomer(req, res);
          } else {
            res.status(200).json({ msg: "Mobile number is already exist" });
          }
        });
    } else {
      await postCustomer
        .find({ mobile_no: req?.body?.mobile_no })
        .then((existCustomerData) => {
          if (existCustomerData?.length == 0) {
            addCustomer(req, res);
          } else {
            res.status(200).json({ msg: "Mobile number is already exist" });
          }
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    customerData.role_id = 3;
    customerData.status = req?.body?.status || 1;
    customerData.entry_date = new Date();
    customerData.entry_by =
      decodeToken?.fetchId(req?.headers["authorization"]) || null;
    customerData.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    customerData.update_date = null;
    customerData.update_by = null;
    customerData.image = req?.file?.filename || "no image";
    const newCustomerData = new postCustomer(customerData);
    newCustomerData.save();
    res.status(200).json("Customer has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    customerData.role_id = 3;
    customerData.update_date = new Date();
    customerData.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    customerData.role = decodeToken?.RoleId(req?.headers["authorization"]);
    const oldImage = await postCustomer.find({ _id: decodeToken?.fetchId(req?.params?.id) }).select("image");
    customerData.status = req?.body?.status || 1;
    let customerId = req?.params?.id;
    if (decodeToken?.fetchId(req?.params?.id)) {
      customerId = decodeToken?.fetchId(req?.params?.id);
    }
    customerData.image = req?.file?.filename || oldImage?.[0]?.image;
    if(req?.file?.filename !== undefined) {
      fs.unlink(`./customerImages/${oldImage?.[0]?.image}`,async(err) => {
        if (err) {
          return res.status(400).json(err)
        } else {
          await postCustomer.updateOne({ _id: customerId }, customerData);
          res.status(200).json("Customer has been updated");
        }
      })
    } else {
      await postCustomer.updateOne({ _id: customerId }, customerData);
      res.status(200).json("Customer has been updated");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCustomerStatus = async (req, res) => {
  try {
    const customerData = req.body;
    customerData.update_date = new Date();
    customerData.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    customerData.role = decodeToken?.RoleId(req?.headers["authorization"]);
    customerData.status = req?.body?.status || 1;
    await postCustomer.updateOne({ _id: req.params.id }, customerData);
    res.status(200).json("Customer has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await postCustomer.deleteOne({ _id: req?.params?.id });
    res.status(200).json("Customer has been deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getFrontCustomer,
  getCustomer,
  getByIdCustomer,
  frontSideCustomerRegistration,
  existCustomer,
  addCustomer,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
};
