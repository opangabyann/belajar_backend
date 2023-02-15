const { check } = require("express-validator");
const Usermodel = require("../models").user;

const createUserValidator = [
  check("nama")
    .isLength({
      min: 1,
    })
    .withMessage("nama wajib diisi"),

  check("email")
    .isEmail()
    .withMessage("gunakan format email")
    .custom((value) => {
      return Usermodel.findOne({
        where : {
            email : value,
        }
      }).then((user) => {
        if (user) {
          return Promise.reject("E-mail sudah digunakan");
        }
      });
    }),

    check("password")
    .isLength({
      min : 8
    })
    .withMessage("password minimal 8 digit"),

    check("role")
    .isLength({
      min:1
    })
    .withMessage("role wajib diisi"),
];

const updateUserValidator = [
  check("nama")
    .isLength({
      min: 1,
    })
    .withMessage("nama wajib diisi"),
];

const updatePassword = [
  check("new_password").isLength({
    min : 8
  }).withMessage("Password minimal 8 karakter")
]
module.exports = { createUserValidator ,updateUserValidator,updatePassword};
