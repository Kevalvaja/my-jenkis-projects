const express = require("express");
const routes = express.Router();
const path = require("path");
const admin = require("./r_admin.js");
const mstBranch = require("./r_mst_branch.js")
const mstBusiness = require("./r_mst_business.js");
const businessSlider = require("./r_business_slider.js");
const businessFacilities = require("./r_business_facilities.js");
const businessTimes = require("./r_business_times.js");
const categorySlider = require("./r_category_slider.js");
const state = require("./r_state.js");
const city = require("./r_city.js");
const mstCategory = require("./r_mst_category.js");
const admin_login = require("./r_admin_login.js");
const business_login = require("./r_business_login.js");
const employee = require("./r_employee.js");
const aboutUs = require("./r_aboutUs.js");
const contactUs = require("./r_contactUs.js");
const mstPlan = require("./r_mstPlan.js")
const role = require("./r_role.js")
const rights = require("./r_rights.js")
const homeSlider = require("./r_home_slider.js")
const rightsMenu = require("./r_rights_menu.js")
const my_plans = require("./r_my_plans.js")
const customer = require("./r_customer.js");
const customer_login = require("./r_customer_login.js");
const employee_login = require("./r_employee_login.js");
const inquiry = require("./r_inquiry.js");
const dashboardCount = require("./r_dashboardCount.js");

// routes.use("/businessGallary", express.static("businessGallary"));
// routes.use("/businessQRcodeImg", express.static("businessQRcodeImg"));
// routes.use("/customerImages", express.static("customerImages"));
routes.use("/admin", admin);
routes.use("/admin_login", admin_login);
routes.use("/business_login", business_login);
routes.use("/mstBranch",mstBranch)
routes.use("/mstBusiness", mstBusiness);
routes.use("/businessSlider", businessSlider);
routes.use("/businessFacilities", businessFacilities);
routes.use("/businessTimes", businessTimes);
routes.use("/categorySlider", categorySlider);
routes.use("/state", state);
routes.use("/city", city);
routes.use("/mstCategory", mstCategory);
routes.use("/employee", employee);
routes.use("/employee_login", employee_login);
routes.use("/aboutUs", aboutUs);
routes.use("/contactUs", contactUs);
routes.use("/mstPlan", mstPlan);
routes.use("/role", role);
routes.use("/rights", rights);
routes.use("/homeSlider", homeSlider);
routes.use("/rightsMenu",rightsMenu)
routes.use("/my_plans",my_plans)
routes.use("/customer",customer)
routes.use("/customer_login",customer_login)
routes.use("/inquiry",inquiry);
routes.use("/dashboardCount",dashboardCount)

module.exports = routes;
