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

const uploadSingle = multer ({storage : storage}).single('file')

module.exports = uploadSingle