const express = require('express');
const { getListproduk, createProduk, getDetailProdukById } = require('../controllers/Produkcontroller');
const { getListuser, createUser, getDetailById, getDetailByParams, updateUser, deleteUser, updatePassword } = require('../controllers/UserController');
const router = express.Router();
const validationResultMiddleware = require('../middleware/validationResultMiddleware');
const userValidator = require('../validator/userValidator')
const produkValidator = require('../validator/produkValidator');
const { register, login, lupaPassword, resetPassword } = require('../controllers/authControllers');
const jwtValidateMiddleware = require('../middleware/jwtValidatemiddleware');

const { createMateriMulti, createMateriBulk, updateMateri, multiDelete, getListMateri, getMateriGuru } = require('../controllers/materiController');

//auth
router.post('/register',userValidator.createUserValidator,validationResultMiddleware,register)
router.post('/login',login)


router.use(jwtValidateMiddleware)
router.get('/user/list',getListuser)
router.get('/materi/list',getListMateri)
router.get('/materi/guru',getMateriGuru)
router.post('/materi/create/multi',createMateriMulti)
router.put('/materi/update/:id',updateMateri)
router.delete('/materi/delete/multi',multiDelete)




module.exports = router