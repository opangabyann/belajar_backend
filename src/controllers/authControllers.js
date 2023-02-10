const UserModel = require("../models").user;
const forgotPasswordModel = require("../models").password;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const dayjs = require("dayjs");
const sendEmailHandle = require("../mail/indegs");
async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, email, password } = payload;
    let hashPassword = await bcrypt.hashSync(password, 10);
    await UserModel.create({
      nama,
      email,
      password: hashPassword,
    });
    res.json({
      status: "Success",
      msg: "Register berhasil",
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;

    const { email, password } = payload;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "email tidak ditemukan, silakan register",
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "email dan password tidak cocok ",
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
      return res.status(422).json({
        status: "Fail",
        msg: "email dan password tidak cocok ",
      });
    }
    const token = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.json({
      status: "Success",
      msg: "Login berhasil",
      token: token,
      user: user,
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function lupaPassword(req, res) {
  try {
    const { email } = req.body;

    //cek apakah user dengan email tsb terdaftar
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });
    //jika tidak terdaftar berikan response dengan msg email tidak terdaftar
    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "email tidak ditemukan, silakan gunakan email yang terdaftar",
      });
    }
    // cek apakah token sudah pernah dibuat pada user tsb di table forgot password
    const currentToken = await forgotPasswordModel.findOne({
      where: {
        userId: user.id,
      },
    });

    // sudah hapus
    if (currentToken !== null) {
      await forgotPasswordModel.destroy({
        where: {
          userId: user.id,
        },
      });
    }
    // jika belum buat token
    const token = crypto.randomBytes(32).toString("hex");
    const date = new Date();
    const expire = date.setHours(date.getHours() + 1);

    await forgotPasswordModel.create({
      userId: user.id,
      token: token,
      expireDate: dayjs(expire).format("YYYY-MM-DD hh:mm:ss"),
    });

    const context = {
      link: `${process.env.MAIL_CLIENT_URL}/reset-password/${user.id}/${token}`,
    };
    const sendEmail = await sendEmailHandle(
      email,
      "lupa password",
      "lupaPassword",
      context
    );

    if (sendEmail === "success") {
      res.json({
        status: "Success",
        msg: "berhasil",
      });
    } else {
      res.status(400).json({
        status: "fail",
        msg: "gunakan email terdaftar",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function resetPassword(req, res) {
  try {
    let { newPassword } = req.body;
    let { userId, token } = req.params;
    const currentToken = await forgotPasswordModel.findOne({
      where: { userId: userId, token: token },
    });

    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
    });

    if (currentToken === null) {
      res.status(403).json({
        msg: 'token invalid',
      });
    } else {
      let userExpired = currentToken.expiredDate;
      let expire = dayjs(Date());
      let difference = expire.diff(userExpired, 'hour');
      if (difference !== 0) {
        res.json({
          status: 'Fail',
          msg: 'Token has expired',
        });
      } else {
        let hashPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.update(
          { password: hashPassword },
          {
            where: {
              id: user.id,
            },
          }
        );
        await forgotPasswordModel.destroy({ where: { token: token } });
        res.json({
          status: '200 OK',
          msg: 'password updated',
        });
      }
    }
  } catch (err) {
    console.log('err', err);
    res.status(403).json({
      status: 'error 403',
      msg: 'ada error',
      err: err,
      // token: currentToken
    });
  }
}

module.exports = { register, login, lupaPassword, resetPassword };
