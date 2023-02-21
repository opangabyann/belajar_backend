const NilaiModel = require("../models").nilai;
const model = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
// const { check } = require("express-validator");
// const {checkQuery} = require("../utils")

async function getListNilai(req, res) {
  const { page, pageSize } = req.query;
  try {
    const nilai = await NilaiModel.findAndCountAll({
        attributes : {
            exclude : ["createdAt","updatedAt"]
        },
        include : [
            {
              model : model.user,
              require : true,
              as : 'user',
              attributes : ["nama"]
            },
           
          ]
    });
    res.json({
      status: "Success",
      msg: "Data nilai ditemukan",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
      },
      data : nilai
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
}

module.exports = { getListNilai };
