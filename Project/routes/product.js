// var express = require('express');
// var router = express.Router();
// const admin = require('../models/admin')
// const { adminverify } = require('../authMiddleWare/adminauth');
// const adminHelpers = require('../controllers/admin-help')
// const User = require('../models/user')
// const products = require('../data/product');
// const productController = require('../controllers/productController');
// const fileUpload = require('express-fileupload')
// router.use(fileUpload())

// router.get('/dashboard',adminverify,async(req,res)=>{
//     if (req.admin) {
//         productController.findProduct().then((data)=>{
//             res.render('api/adminDashboard',{data}) 
//         })
        
//     }else{
//         res.render('admin/login',{
//         nameError :'',
//         passErr :'',
//         nameVal:''
//      })
//     }
// })

// router.get('/add-product',(req,res)=>{
//     res.render('admin/add-products')
// })

// router.post('/add-product',(req,res)=>{ 
//     productController.addProduct(req.body).then((data)=>{
//         let image = req.files.image
//         image.mv(`public/product-image/${data}.jpg`,(err,done)=>{
//             if(!err){
//                 res.redirect('/admin/dashboard')
//             }
//         })
//     })
// })


// router.get('/userMangement',adminverify,async(req,res)=>{
//     let data = await User.find()
//     console.log(data);
//     res.render('admin/adDashUserManage',{data})
// })