const express = require('express');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');

const routers = express.Router();
const multer = require('multer');
const uploadSingle = require('../storage/fileuploadsingle');
const uploadMulti = require('../storage/fileuploadMulti');

// const imageFilter = (req, file, cb) => {
//   if (!file.originalname.match(/\.(jpg/jpeg/png/gif)$/)) {
//     return cb(null, false)
//   }
//   cb(null, true)
// }
const upload = multer({
  dest: 'public',
  //  fileFilter: imageFilter
});
const multipleUpload = multer({ dest: 'public' });

// =========================== GET ========================= //
routers.use(authMiddleware)

routers.get('/', (req, res) => {
  res.send('Hello world');
});

routers.get('/user', (req, res) => {
  res.send({
    status: 200,
    message: 'Success',
    data: {
      nama: 'Hilmi',
    },
  });
});
routers.get('/absensi/:nama', (req, res) => {
  let { status, dariTanggal, sampaiTanggal } = req.query;
  let { nama } = req.params;
  res.send({
    status: 200,
    message: 'Success',
    data: {
      nama: nama,
      status: status,
      dari_tanggal: dariTanggal,
      sampai_tanggal: sampaiTanggal,
    },
  });
});
routers.get('/siswa/:nama', (req, res) => {
  // let nama = req.params.nama;
  let { nama } = req.params;
  let { angkatan, sekolah } = req.query;

  console.log('params =>', req.params);
  console.log('query =>', req.query);

  res.send({
    status: 200,
    message: 'Siswa ditemukan',
    data: {
      nama: `${nama}`,
      kelas: `${req.query.kelas}`,
      angkatan: `${angkatan}`,
      sekolah: `${sekolah}`,
    },
  });
});

// =========================== POST ========================= //
routers.post("/user/create", (req,res)=> {

  const payload = req.body
  res.json({
    status : "Success",
    msg : "Latihan request body",
    payload : payload
  })
})

routers.post('/', authMiddleware, (req, res) => {
    res.send('Hello world');
  });
  routers.get('/user', (req, res) => {
    res.send({
      status: 200,
      message: 'Success',
      data: {
        nama: 'Hilmi',
      },
    });
  });
  routers.post('/user', (req, res) => {
    const { nama, kelas } = req.body;
    res.send({
      status: 200,
      message: 'Success',
      data: {
        nama: nama,
        kelas: kelas,
      },
    });
  });

  routers.post("/upload/multi", uploadMulti, (req, res) => {
    const files = req.files;
    const url = files.map((file, index) =>{
      return `${req.protocol}://${req.get('host')}/${req.files[index].filename}`
    })
  
    res.send({
      status: 200,
      message: 'Upload Success',
      data: {
        file: req.files,
        fileURL: [
          url
        ]
      },
    });
  });

  routers.post("/upload/single", uploadSingle , (req,res)=>{
    res.send({
      status : "Success",
      msg : "Upload Success",
      file : req.file,
      fileUrl : `${req.protocol}://${req.get("host")}/${req.file.filename}`
    })
  })
  
  // routers.post('/upload', upload.single('file'), (req, res) => {
  //   const file = req.file;
  
  //   if (file) {
  //     const target = path.join(__dirname, 'public', file.originalname);
  //     fs.renameSync(file.path, target);
  //     url = `${req.protocol}://${req.get('host')}/${file.originalname}`;
  //     console.log('url =>', url);
  
  //     res.send({
  //       status: 200,
  //       message: 'Success, File uploaded',
  //       url: url,
  //     });
  //   } else {
  //     res.send({
  //       status: 400,
  //       message: 'Error, File not found',
  //     });
  //   }
  // });
  // routers.post(
  //   '/multipleUpload',
  //   multipleUpload.array('file', 10),
  //   (req, res) => {
  //     const files = req.file;
  
  //     files.map((file) => {
  //       if (file) {
  //         const target = path.join(__dirname, 'public', file.originalname);
  //         fs.renameSync(file.path, target);
  //       }
  //     });
  
  //     res.send({
  //       status: 200,
  //       message: 'Success, File uploaded',
  //     });
  //   }
  // );
  
  module.exports = routers;