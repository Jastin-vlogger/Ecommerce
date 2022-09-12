var express = require('express');
var router = express.Router();
const admin = require('../models/admin')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const  authentication = require('../authMiddleWare/adminauth');
const { route } = require('./users');
const adminHelpers = require('../controllers/checkout')
const User = require('../models/user')
const products = require('../data/product');
const productController = require('../controllers/productController');
const fileUpload = require('express-fileupload')
const userController = require('../controllers/user-helpers');
const categoryControler = require('../controllers/category')
const order = require('../controllers/orders')
const addcart = require('../controllers/add-to-cart')



const credential = {
    email:'justinkj765@gmail.com',
    password:'1234'
}
router.use(fileUpload())

router.get("/login",authentication.adminLoggedIn,async(req, res) => {
    res.render('admin/login',{
        nameError :'',
        passErr :'',
        nameVal:'',
     });
})

router.post('/login',(req,res)=>{
    if (credential.email === req.body.email && credential.password===req.body.password  ) {
        let {email} = req.body
        //the important part
        const token = jwt.sign({email},process.env.ADMIN_TOKEN_SECRET ,{expiresIn:"2d"})
        res.cookie('adminToken',token,{
            httpOnly:true,
        })
        res.redirect('/admin/dashboard')
    }else if(credential.email != req.body.email){
        res.render('admin/login',{
            nameError :'Email not found',
            passErr :'',
            nameVal:req.body.email,
         })
    }else if(credential.password != req.body.password){
        res.render('admin/login',{
            nameError :'',
            passErr :'Password incorrect',
            nameVal:req.body.email,
         })
    }
})

router.get('/dashboard',authentication.adminverify,(req,res)=>{
    res.render('admin/dashboard')
})

router.get('/productmanagement',authentication.adminverify,(req,res)=>{
        productController.findProduct().then((data)=>{
            res.render('admin/adProductManage',{data}) 
        })   
})

router.get('/add-product',authentication.adminverify,async(req,res)=>{
    let categories = await productController.findCategory()
    res.render('admin/add-products',{categories})
})

router.post('/add-product',async(req,res)=>{  
    productController.addProduct(req.body).then((data)=>{
        let image = req.files.image
        let image1 = req.files.images
        let image2 = req.files.imagess
        let image3 = req.files.imagesss
        image.mv(`public/product-image/${data}.jpg`) 
        image1.mv(`public/product-image/${data}.jpg`) 
        image2.mv(`public/product-image/${data}.jpg`) 
        image3.mv(`public/product-image/${data}.jpg`) 
        res.redirect('/admin/productmanagement')
    })
})

router.get('/delete-product/:id',authentication.adminverify,(req,res)=>{ 
    let userId = req.params.id
    productController.deleteProduct(userId)
    res.redirect('/admin/productmanagement')
})

router.get('/edit-product/:id',authentication.adminverify,async(req,res)=>{
    let userId = req.params.id
    let categories = await productController.findCategory()
    productController.updateProduct(userId).then((data)=>{
    res.render('admin/edit-product',{data,categories})
    })
}) 

router.post('/edit-product/:id',authentication.adminverify,(req,res)=>{
    let {body} = req
    let id = req.params.id
    productController.updatedProduct(body,id).then((data)=>{
        console.log(data+'+++++++++');
        let image = req.files.image 
        image.mv(`public/product-image/${data}.jpg`,(err,done)=>{
            if(!err){
                res.redirect('/admin/productmanagement')
            }
        }) 
    })
})

router.get('/userMangement',authentication.adminverify,async(req,res)=>{
    let data = await User.find()
    res.render('admin/adDashUserManage',{data})
})

router.get('/block-user/:id',async(req,res)=>{
    let userId = req.params.id
    userController.blockUser(userId).then((data)=>{
        return new Promise (async(resolve,reject)=>{
            await User.findOne({_id:data._id}).then((udata) => {
            
                if(udata.blocked === true ){
                    res.clearCookie('token')
                }
                res.redirect('/admin/userMangement')
            })
        })
        
       
    })
})

router.get('/unblock-user/:id',(req,res)=>{
    let userId = req.params.id
    userController.unblockUser(userId).then((data)=>{
       res.redirect('/admin/userMangement')
    })
})

router.get('/category',authentication.adminverify,(req,res)=>{
    categoryControler.findcategory().then((data)=>{
        res.render('admin/category',{data}) 
    })
})

router.get('/add-category',authentication.adminverify,(req,res)=>{
    res.render('admin/add-category')
})

router.post('/add-category',authentication.adminverify,(req,res)=>{
    categoryControler.addCategory(req.body).then((data)=>{
        res.redirect('/admin/category')
    })
})

router.get('/edit-category/:id',authentication.adminverify,(req,res)=>{ 
    let userId = req.params.id
    categoryControler.findCategory(userId).then((data)=>{
    res.render('admin/edit-category',{data})
    })
})

router.post('/edit-category',authentication.adminverify,(req,res)=>{
    let {body} = req
    categoryControler.updatedCategory(body).then((data)=>{
        res.redirect('/admin/category')
    })
})  

router.get('/delete-category/:id',authentication.adminverify,(req,res)=>{ 
    let userId = req.params.id
    categoryControler.deletecategory(userId)
    res.redirect('/admin/category')
})

/* -------------------------------admin view ordered products ------------------------------- */
router.get('/orderMangement',authentication.adminverify,order.findorders)


router.get('/cancelorder/:id',authentication.adminverify,addcart.cancelOrderAdmin)

router.get('/change-status/:id',authentication.adminverify,addcart.changestatus)

router.get('/logout',authentication.adminverify,(req,res)=>{
    res.clearCookie('adminToken').redirect('/admin/login')
})

module.exports = router;
 