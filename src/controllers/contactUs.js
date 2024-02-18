const postContactUs = require("../models/m_contactUs.js");
const decodeToken = require("./decodeToken.js");

const getContactUs = async (req, res) => {
  try {
    const contactUs = await postContactUs.find();
    res.status(200).json(contactUs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdContactUs = async (req, res) => {
  try {
    const contactUsData = await postContactUs.findById({ _id: req.params.id });
    res.status(200).json(contactUsData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addContactUs = async (req, res) => {
  try {
    const contactUsData = req.body;
    contactUsData.status = req?.body?.status || 1;
    contactUsData.entry_date = new Date();
    contactUsData.entry_by = decodeToken?.fetchId(req?.headers["authorization"]);
    contactUsData.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    contactUsData.update_date = null;
    contactUsData.update_by = null;
    const newContactUsData = new postContactUs(contactUsData);
    newContactUsData.save();
    res.status(200).json("Contact Us has been inserted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateContactUs = async (req, res) => {
  try {
    const contactUsData = req.body;
    contactUsData.update_date = new Date();
    contactUsData.update_by = decodeToken?.fetchId(req?.headers["authorization"]);
    contactUsData.role = decodeToken?.RoleId(req?.headers["authorization"]) || 0;
    await postContactUs.updateOne({ _id: req?.params?.id }, contactUsData);
    res.status(200).json("Contact Us has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteContactUs = async (req, res) => {
  try {
    await postContactUs.deleteOne({ _id: req.params.id });
    res.status(200).json("Contact Us has been deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getContactUs,
  getByIdContactUs,
  addContactUs,
  updateContactUs,
  deleteContactUs,
};
