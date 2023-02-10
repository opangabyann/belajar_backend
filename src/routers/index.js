const express = require('express');
const { getListproduk, createProduk, getDetailProdukById } = require('../controllers/Produkcontroller');
const { getListuser, createUser, getDetailById, getDetailByParams, updateUser, deleteUser, updatePassword } = require('../controllers/UserController');
const router = express.Router();
const validationResultMiddleware = require('../middleware/validationResultMiddleware');
const userValidator = require('../validator/userValidator')
const produkValidator = require('../validator/produkValidator');
const { register, login, lupaPassword, resetPassword } = require('../controllers/authControllers');
const jwtValidateMiddleware = require('../middleware/jwtValidatemiddleware');
const { createArtikel, getListArtikel, updateArtikel, deleteArtikel, createArtikelBulk, createArtikelmulti, deleteArtikelMulti } = require('../controllers/ArtikelContoller');

//auth
router.post('/register',register)
router.post('/login',login)
router.post('/lupa-password', lupaPassword)
router.post('/reset-password/:userId/:token',resetPassword)

router.use(jwtValidateMiddleware)
//user
router.put('/update-password', userValidator.updatePassword,validationResultMiddleware,updatePassword)
router.get('/user/list',getListuser)
router.post('/user/create', userValidator.createUserValidator,validationResultMiddleware,createUser )

router.get('/user/detail/:id', getDetailById)

router.get('/user/list/:email', getDetailByParams)
router.put('/user/update/:id',userValidator.updateUserValidator,validationResultMiddleware,updateUser)
router.delete('/user/delete/:id',deleteUser)

//produk
router.get('/produk/list',getListproduk )

router.post('/produk/create',produkValidator.createProdukValidator,validationResultMiddleware,createProduk)
router.get('/produk/detail/:id',getDetailProdukById)

//artikel
router.get('/artikel',getListArtikel)
router.post("/artikel/create" , createArtikel)
router.post("/artikel/create/bulk" , createArtikelBulk)
router.post("/artikel/create/multi" , createArtikelmulti)
router.put('/artikel/update/:id',updateArtikel)
router.delete('/artikel/delete/:id',deleteArtikel)
router.delete('/delete/multi',deleteArtikelMulti)



module.exports = router