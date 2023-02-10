const UserModel = require("../models").user;
const bcrypt = require('bcrypt');

async function getListuser(req, res) {
  try {
    const user = await UserModel.findAll();
    res.json({
      status: "Success",
      msg: "Data user ditemukan",
      data: user,
    });
  } catch (e) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
}

//create data ke database
async function createUser(req, res) {
  try {
    const payload = req.body;
    const { nama, email, tempatLahir, tanggalLahir } = payload;
    await UserModel.create({
      nama: nama,
      email: email,
      isActive: true,
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
    });
    res.json({
      status: "Success",
      msg: "berhasil tersimpan",
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
}

async function getDetailById(req, res) {
  try {
    const id = req.params.id;

    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(404).json({
        status: "fail",
        msg: "user tidak ditemukan",
      });
    }
    res.json({
      status: "Success",
      msg: "User berhasil",
      data: user,
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
}

async function getDetailByParams(req, res) {
  try {
    const { email } = req.params;

    const user = await UserModel.findOne({
      where: {
        nama: email,
      },
    });

    if (user === null) {
      res.status(404).json({
        status: "fail",
        msg: "user tidak ditemukan",
      });
    }
    res.json({
      status: "Success",
      msg: "User berhasil",
      id: user,
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { nama, tempatLahir, tanggalLahir } = payload;
    const user = await UserModel.findByPk(id);

    await UserModel.update(
      { nama, tempatLahir, tanggalLahir },
      {
        where: {
          id: id,
        },
      }
    );

    // await UserModel.update(
    //   { nama: nama, tempatLahir: tempatLahir, tanggalLahir: tanggalLahir },
    //   {
    //     where: {
    //       id: id,
    //     },
    //   }
    // );

    if (user === null) {
      res.status(404).json({
        status: "fail",
        msg: "user tidak ditemukan",
      });
    }
    res.json({
      status: "Success",
      msg: "Berhasil",
      id: id,
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);
    res.json({
      status: "Success",
      msg: "Delete Berhasil",
    });
    if (user === null) {
      return res.status(400).json({
        status: "fail",
        msg: "user tidak ditemukan",
      });
    }

    await UserModel.destroy({
      where: {
        id: id,
      },
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function updatePassword(req, res) {
  try {
    const payload = req.body;
    const { email, password, new_password } = payload;

    const user = await UserModel.findOne({
      where: {
        email: req.email,
      },
    });

    const verify = await bcrypt.compareSync(password, user.password);

    if (user === null) {
      res.json({
        status: "gagal",
        msg: "email tidak ditemukan",
      });
    }

    if (verify) {
      let hashPassword = await bcrypt.hash(new_password, 10);
      await UserModel.update(
        { password: hashPassword},
        { where: { id: user.id } }
      );
      res.json({
        status: "berhasil",
        msg: "berhasil mengupdate password",
      });
    }else{
      res.json({
        msg : "password lama tidak sesuai"
      })
    }
  } catch (err) {2
    console.log("err", err)
    res.status(403).json({
      status: "gagal",
      msg: "Ada kesalahan",
      err: err,
    });
  }
}
module.exports = {
  getListuser,
  createUser,
  getDetailById,
  getDetailByParams,
  updateUser,
  deleteUser,
  updatePassword,
};
