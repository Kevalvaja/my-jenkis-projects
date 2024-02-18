const mongoose = require("mongoose");

const businessFacilitiesImages = mongoose.Schema({
  bus_faclities_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "business_facilities",
  },
  image: {
    type: String,
    require: true,
  },
  type: {
    type: Number,
    require: true,
  },
});

const postBusinessFtsImages = mongoose.model(
  "business_facilities_imgs",
  businessFacilitiesImages
);

module.exports = postBusinessFtsImages;
