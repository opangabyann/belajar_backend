const ProdukModel = require('../models').produk

async function getListproduk(req,res){
    try{
        const produk = await ProdukModel.findAll();
        res.json({
            status : "Success",
            msg : "Data produk ditemukan",
            data : produk
        })
    }catch(e){
        res.status(403).json({
            status : "Fail",
            msg : "Ada kesalahan"
        })
    }
    
}

async function createProduk(req,res){
    try {

        const payload = req.body
        let {nama,harga,stok,deskripsi} = payload
        const produk = await ProdukModel.create({
            nama : nama,
            harga : harga,
            stok : stok,
            deskripsi : deskripsi
        })
        res.json({
            status : "Success",
            msg : "berhasil tersimpan",
            produk : produk
        })
    } catch (error) {
        res.status(403).json({
            status : "Fail",
            msg : "Ada kesalahan"
        })
    }
}

async function getDetailProdukById(req,res){
    try {
        const id = req.params.id;

        const user = await ProdukModel.findByPk(id);
        

        if(user === null) {
            res.status(404).json({
                status: 'fail',
                msg : 'produk tidak ditemukan'
            })
        }
        res.json({
            status : "Success",
            msg : 'produk berhasil ditemukan',
            id : id
        })
    } catch (error) {
        res.status(403).json({
            status : "Fail",
            msg : "Ada kesalahan"
        })
    }
}

module.exports = {getListproduk,createProduk,getDetailProdukById}