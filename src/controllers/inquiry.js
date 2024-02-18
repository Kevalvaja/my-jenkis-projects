const postInquiry = require("../models/m_inquiry.js");
const decodedToken = require("./decodeToken.js");
const getInquiry = async (req, res) => {
  try {
    const inquiryData = await postInquiry.find();
    res.status(200).json(inquiryData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getByIdInquiry = async (req, res) => {
  try {
    const inquiryData = await postInquiry.findById({ _id: req?.params?.id });
    res.status(200).json(inquiryData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addInquiry = async (req, res) => {
  try {
    const inquiryData = req.body;
    inquiryData.status = req?.body?.status || 1;
    inquiryData.entry_date = new Date();
    inquiryData.update_date = null;
    const newInquiryData = new postInquiry(inquiryData);
    newInquiryData.save();
    res.status(200).json("Inquiry send successfully...");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateInquiry = async (req, res) => {
  try {
    const inquiryData = req.body;
    inquiryData.update_date = new Date();
    await postInquiry.updateOne({ _id: req?.params?.id }, inquiryData);
    res.status(200).json("Inquiry has been updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    await postInquiry.deleteOne({ _id: req.params.id });
    res.status(200).json("Inquiry has been deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getInquiry,
  getByIdInquiry,
  addInquiry,
  updateInquiry,
  deleteInquiry,
};
