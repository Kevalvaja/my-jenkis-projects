const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes= require('./routes/index')
const db = require('./helpers/db')
const app = express();

dotenv.config();

app.use(cors());

app.use("/businessGallary", express.static("businessGallary"));
app.use("/businessQRcodeImg", express.static("businessQRcodeImg"));
app.use("/customerImages", express.static("customerImages"));

// use of body-parser
const {json, urlencoded} = bodyParser; // this is called dstrucring of code
app.use(urlencoded({extended: false}));
app.use(json()); // it will receive json file
app.use(routes); 
// app.use(db); 

module.exports = app;