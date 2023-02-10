const ArtikelModel = require("../models").artikel;
const { Op } = require("sequelize");

// async function getListArtikel(req, res) {
//   try {
//     // const id = req.id
//     const artikel = await ArtikelModel.findAll({
//       where: {
//         userId: req.id,
//       },
//     });
//     res.json({
//       status: "Success",
//       msg: "Artikel ditemukan",
//       data: artikel,
//     });
//   } catch (error) {}
// }

async function getListArtikel(req, res) {
  const { keyword,year,title, offset,page , pageSize,sortBy = 'id',orderBy = "desc" } = req.query;
  try {
    // const id = req.id
    const artikel = await ArtikelModel.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      // where: {
      //   [Op.or]: [
      //     {
      //       title: {
      //         [Op.substring] : keyword
      //       },
      //     },
      //     {
      //       description: {
      //         [Op.substring] : keyword
      //       },
      //     },
      //   ],

      //   year : {
      //     [Op.gte] : year
      //   }
      // },

      order : [[
        sortBy,orderBy
      ]],
      limit : pageSize,
      offset : offset
    });
    res.json({
      status: "Success",
      msg: "Artikel ditemukan",
      pagination : {
        currentPage : page,
        pageSize : pageSize,
        totalData : artikel.count
      },
      data: artikel,
      // query: {
      //   title,
      //   dari_tahun,
      //   sampai_tahun,
      // },
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}
// async function getListArtikel(req, res) {
//   const { title, dari_tahun, sampai_tahun } = req.query;
//   try {
//     // const id = req.id
//     const artikel = await ArtikelModel.findAll({
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//       where: {
//         userId: req.id,
//         title: {
//           [Op.substring]: title,
//         },
//         year: {
//           [Op.between]: [dari_tahun, sampai_tahun],
//         },
//       },
//     });
//     res.json({
//       status: "Success",
//       msg: "Artikel ditemukan",
//       data: artikel,
//       query: {
//         title,
//         dari_tahun,
//         sampai_tahun,
//       },
//     });
//   } catch (error) {}
// }

async function createArtikel(req, res) {
  try {
    const payload = req.body;
    const { title, year, description } = payload;
    await ArtikelModel.create({
      title: title,
      year: year,
      description: description,
      userId: req.id,
    });
    res.json({
      status: "Success",
      msg: "create artikel berhasil",
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}

async function createArtikelmulti(req, res) {
  try {
    const payload = req.body.payload;
    // const {payload} = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;
    await Promise.all(
      payload.map(async (item) => {
        try {
          await ArtikelModel.create({
            title: item.title,
            year: item.year,
            description: item.description,
            userId: req.id,
          });
          success = success + 1;
        } catch (error) {
          fail = fail + 1;
        }
      })
    );
    res.status(201).json({
      status: "Success",
      msg: `berhasil menambahkan ${success} dari ${jumlah} dan gagal ${fail}`,
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}

async function createArtikelBulk(req, res) {
  try {
    const payload = req.body.payload;
    // const {payload} = req.body;

    payload.map((item, index) => {
      item.userId = req.id;
    });
    await ArtikelModel.bulkCreate(payload);
    res.status(201).json({
      status: "Success",
      msg: "berhasil bulk",
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}

async function updateArtikel(req, res) {
  try {
    // const userId = req.id
    const { id } = req.params;
    const payload = req.body;
    const { title, year, description } = payload;
    const artikel = await ArtikelModel.findByPk(id);

    if (artikel === null) {
      return res.json({
        status: "Fail",
        msg: "artikel tidak ditemukan",
      });
    }
    if (artikel.userId === req.id) {
      return res.json({
        status: "Fail",
        msg: "anda tidak bisa mengubah artikel ini karna artikel ini ditulis oleh orang lain",
      });
    }

    await ArtikelModel.update(
      { title, year, description },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      status: "Success",
      msg: "artikel Berhasil diupdate",
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

async function deleteArtikel(req, res) {
  try {
    const { id } = req.params;
    const artikel = await ArtikelModel.findByPk(id);
    if (artikel === null) {
      return res.json({
        status: "Fail",
        msg: "artikel tidak ditemukan",
      });
    }
    if (artikel.userId !== req.id) {
      return res.json({
        status: "Fail",
        msg: "anda tidak bisa menghapus karna artikel ini ditulis oleh orang lain",
      });
    }
    await ArtikelModel.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "Success",
      msg: "Delete Berhasil",
      data: artikel,
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function deleteArtikelMulti(req, res) {
  try {
    const { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;
    await Promise.all(
      payload.map(async (items, index) => {
        try {
          const title = await ArtikelModel.findOne({
            where: { id: items.id },
          });
          if (title.userId !== req.id) {
            // return res.json({
            //   status: "Fail",
            //   msg: `bukan artikel anda`,
            // });
            return fail + 1;
          }
          await ArtikelModel.destroy({
            where: { id: items.id },
          });
          console.log(items.id);
          console.log(title);
          success = success + 1;
        } catch (error) {
          console.log(error);
          // fail = fail + 1;
        }
      })
    );
    res.status(201).json({
      status: "Success",
      msg: `berhasil delete ${success} artikel dari ${jumlah} artikel dan gagal ${fail}`,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Fail",
      msg: "Something went wrong",
      err: error,
    });
  }
}

module.exports = {
  createArtikel,
  getListArtikel,
  updateArtikel,
  deleteArtikel,
  createArtikelBulk,
  createArtikelmulti,
  deleteArtikelMulti,
};
