const jwt = require("jsonwebtoken");
const postRights = require("../models/m_rights.js");

const verifyToken = (req, res, next) => {
  try {
    const header = req?.headers["authorization"];
    // console.log(header);
    if (header !== undefined) {
      req.token = header;
      jwt.verify(req?.token, process.env.SECRETE, (err, data) => {
        if (err) {
          // console.log("Call function if");
          res.status(200).json({ msg: "Invalid Token." });
        } else {
          const roleId = jwt.decode(req?.token, process.env.SECRETE);
          // || roleId?.role === 3
          if (roleId?.role === 1) {
            next();
          } else {
            const AccessData = async () => {
              let data;
              if (req?.method === "GET") {
                data = await postRights.aggregate([
                  {
                    $match: {
                      $and: [
                        { role_id: roleId?.role },
                        { is_view: 1 },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "rights_menus",
                      localField: "rights_menu_id",
                      foreignField: "_id",
                      as: "rights_menus",
                    },
                  },
                  {
                    $unwind: "$rights_menus",
                  },
                  {
                    $match: { "rights_menus.menu_name": req?.query?.menu_name },
                  },
                  {
                    $project: {
                      is_added: 0,
                      is_edited: 0,
                      is_deleted: 0,
                      rights_menus: 0,
                    },
                  },
                ]);
              } else if (req?.method === "POST") {
                data = await postRights.aggregate([
                  {
                    $match: {
                      $and: [
                        { role_id: roleId?.role },
                        { is_added: 1 },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "rights_menus",
                      localField: "rights_menu_id",
                      foreignField: "_id",
                      as: "rights_menus",
                    },
                  },
                  {
                    $unwind: "$rights_menus",
                  },
                  {
                    $match: { "rights_menus.menu_name": req?.query?.menu_name },
                  },
                  {
                    $project: {
                      is_view: 0,
                      is_edited: 0,
                      is_deleted: 0,
                      rights_menus: 0,
                    },
                  },
                ]);
              } else if (req?.method === "PUT") {
                data = await postRights.aggregate([
                  {
                    $match: {
                      $and: [
                        { role_id: roleId?.role },
                        { is_edited: 1 },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "rights_menus",
                      localField: "rights_menu_id",
                      foreignField: "_id",
                      as: "rights_menus",
                    },
                  },
                  {
                    $unwind: "$rights_menus",
                  },
                  {
                    $match: { "rights_menus.menu_name": req?.query?.menu_name },
                  },
                  {
                    $project: {
                      is_view: 0,
                      is_added: 0,
                      is_deleted: 0,
                      rights_menus: 0,
                    },
                  },
                ]);
              } else if (req?.method === "DELETE") {
                data = await postRights.aggregate([
                  {
                    $match: {
                      $and: [
                        { role_id: roleId?.role },
                        { is_deleted: 1 },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "rights_menus",
                      localField: "rights_menu_id",
                      foreignField: "_id",
                      as: "rights_menus",
                    },
                  },
                  {
                    $unwind: "$rights_menus",
                  },
                  {
                    $match: { "rights_menus.menu_name": req?.query?.menu_name },
                  },
                  {
                    $project: {
                      is_view: 0,
                      is_added: 0,
                      is_edited: 0,
                      rights_menus: 0,
                    },
                  },
                ]);
              }
              // console.log(data);
              if(data?.length === 1){
                next();
              } else {
                res.status(200).json({msg: "Sorry you have no rights"});
              }
            };
            AccessData();
          }
        }
      });
    } else {
      res.status(200).json({ msg: "Not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { verifyToken };
