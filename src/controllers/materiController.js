const { Op } = require("sequelize");
const materi = require("../models/materi");

const MateriModel = require("../models").materi;

async function createMateriMulti(req, res) {
  try {
    // const payload = req.body.payload;
    const { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;

    if (req.role !== "guru") {
      return res.status(403).json({
        status: "fail",
        msg: "murid tidak dapat membuat materi",
      });
    }
    await Promise.all(
      payload.map(async (item, index) => {
        try {
          await MateriModel.create({
            mataPelajaran: item.mataPelajaran,
            materi: item.materi,
            kelas: item.kelas,
            userID: req.id,
          });
          success = success + 1;
        } catch (error) {
          fail = fail + 1;
        }
      })
    );
    res.status(201).json({
      status: "Success",
      r: req.role,
      msg: `berhasil menambahkan ${success} dari ${jumlah} dan gagal ${fail}`,
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}

async function updateMateri(req, res) {
  try {
    // const userId = req.id
    const { id } = req.params;
    const payload = req.body;
    const { materi, mataPelajaran, kelas } = payload;
    const Materi = await MateriModel.findByPk(id);

    if (req.role !== "guru") {
      return res.status(403).json({
        status: "error",
        msg: "murid tidak dapat mengubah materi",
      });
    }
    if (Materi === null) {
      return res.json({
        status: "Fail",
        msg: "materi tidak ditemukan",
      });
    }
    if (Materi.userID !== req.id) {
      return res.json({
        status: "Fail",
        msg: "ini bukan materi anda",
      });
    }

    await MateriModel.update(
      { materi, mataPelajaran, kelas },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      status: "Success",
      msg: "materi Berhasil diupdate",
      // id: id,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function multiDelete(req, res) {
  try {
    const { id } = req.body;
    const Materi = await MateriModel.findOne({
      where: {
        id: id,
      },
    });
    let success = 0;
    let fail = 0;
    let jumlah = id.length;

    if (req.role === "murid") {
      return res.status(403).json({
        status: "error",
        msg: "murid tidak dapat mendelete materi",
      });
    }
    if(Materi == null){
        return res.status(403).json({
            status : "error",
            msg : "materi yang ingin dihapus tidak ditemukan"
        })
    }

    if (req.role === "guru" || Materi.id !== req.id) {
      if (req.role === "guru") {
        await MateriModel.destroy({
          where: {
            id: id,
          },
        });
        success = success + 1;
      }

      if ( Materi.id !== req.id) {
        fail = fail + 1
      }
    }

    res.json({
      status: "Success",
      msg: `${success} materi berhasil dihapus dan ${fail} materi gagal dari ${jumlah} materi`,
      // id: id,
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function getListMateri (req,res){
  const {keyword,offset,page,pageSize,sortBy,orderBy} = req.query
  try {
    const Materi = await MateriModel.findAndCountAll({
      where : {
        [Op.or] : [
          {
            mataPelajaran : {
              [Op.substring] : keyword
            }
          },
          {
            kelas : {
              [Op.substring] : keyword
            }
          },
          {
            materi : {
              [Op.substring] : keyword
            }
          }
        ]
      },

      order : [[
        sortBy,orderBy
      ]],
      limit : pageSize,
      offset : offset
    })

    res.json({
      status: "Success",
      msg: 'materi ditemukan',
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: Materi.count,
      },
      materi : Materi
      // id: id,
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function getMateriGuru (req,res) {
  const {keyword,isAll} = req.query
  let materi 
  try {
    if (req.role === 'murid') {
      res.status(403).json({
        status: "erorr",
        msg: "murid tidak bisa melihat materi "
      });
    }

    if(parseInt(isAll) === 1){
      materi = await MateriModel.findAll({
        [Op.or] : [
          {
            mataPelajaran : {
              [Op.substring] : keyword
            }
          },
          {
            kelas : {
              [Op.substring] : keyword
            }
          },
          {
            materi : {
              [Op.substring] : keyword
            }
          }
        ]
      })
    }else{
      materi = await MateriModel.findAll({
        where : {
          userID : req.id,
  
          [Op.or] : [
            {
              mataPelajaran : {
                [Op.substring] : keyword
              }
            },
            {
              kelas : {
                [Op.substring] : keyword
              }
            },
            {
              materi : {
                [Op.substring] : keyword
              }
            }
          ]
        }
      })
    }
    if (materi === null) {
      res.status(403).json({
        status: "erorr",
        msg: "materi tidak ditemukan"
      });
    }
    res.json({
      status: "Success",
      msg: 'materi ditemukan',
      materi : materi
      // id: id,
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}


module.exports = { createMateriMulti, updateMateri, multiDelete, getListMateri, getMateriGuru};
