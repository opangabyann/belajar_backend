const { check } = require("express-validator");
const Usermodel = require("../models").produk;

const createProdukValidator = [
  check("nama")
    .isLength({
      min: 1,
    })
    .withMessage("nama wajib diisi"),
    check("harga")
    .isLength({
        min : 1
    })
    .withMessage("harga wajib diisi"),
];

module.exports = { createProdukValidator };
