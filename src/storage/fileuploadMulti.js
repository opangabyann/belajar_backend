const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination : function (req , file ,cb) {
        cb(null,path.join(__dirname,'uploads'));
    },
    //konfigurasi penamaan yang unik
    filename : function (req, file , cb){
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
})

const uploadMulti = multer ({storage : storage}).array('file',10)

module.exports = uploadMulti