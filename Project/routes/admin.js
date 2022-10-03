var express = require('express');
var router = express.Router();
require('dotenv').config()
const authentication = require('../authMiddleWare/adminauth');
const { route } = require('./users');
const adminHelpers = require('../services/checkout')
const User = require('../models/user')
// const products = require('../data/product');
const productController = require('../services/productController');
const fileUpload = require('express-fileupload')
const userController = require('../services/user');
const categoryControler = require('../services/category')
const order = require('../services/orders')
const addcart = require('../controller/product');
const Product = require('../models/product');
const Admin = require('../services/admin')
const Category = require('../models/category')
const coupon = require('../controller/coupon')
const admin = require('../controller/admin')

router.use(fileUpload())

router.get("/login", authentication.adminLoggedIn, async (req, res) => {
    res.render('admin/login', {
        nameError: '',
        passErr: '',
        nameVal: '',
    })
})

router.post('/login', admin.login)

router.get('/dashboard', authentication.adminverify, async (req, res) => {
    try {
        let data = await Admin.findOrders()
        let totalUsers = await Admin.totalUser()
        let todaysEarning = await Admin.todaytotal()
        let month = await Admin.monthtotal()
        let year = await Admin.yeartotal()
        console.log(year);
        res.render('admin/dashboard', { data, title: 'dashboard', totalUsers, todaysEarning, month, year })
    } catch (error) {
        console.log(error);
    }
})

router.get('/productmanagement', authentication.adminverify, async (req, res) => {
    let search = '';
    if (req.query.search) {
        search = req.query.search
    }
    let page = 1;
    if (req.query.page) {
        page = req.query.page
    }
    const limit = 5
    let data = await Product.find({
        $or: [
            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
            { category: { $regex: '.*' + search + '.*', $options: 'i' } },
        ]
    })

        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

    let count = await Product.find({
        $or: [
            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
            { category: { $regex: '.*' + search + '.*', $options: 'i' } },
        ]
    }).countDocuments()

    // productController.findProduct(search,page).then((data,count)=>{
    res.render('admin/adProductManage', { data, totalpages: Math.ceil(count / limit), currentPage: page, title: 'Products' })
    // })  
})

router.get('/add-product', authentication.adminverify, async (req, res) => {
    let categories = await productController.findCategory()
    res.render('admin/add-products', { categories, title: 'Add Product' })
})

router.post('/add-product', async (req, res) => {
    productController.addProduct(req.body).then((data) => {
        let image = req.files.image
        let image1 = req.files.images
        let image2 = req.files.imagess
        let image3 = req.files.imagesss
        image.mv(`public/product-image/${data}.jpg`)
        image1.mv(`public/product-image/${data}1.jpg`)
        image2.mv(`public/product-image/${data}2.jpg`)
        image3.mv(`public/product-image/${data}3.jpg`)
        res.redirect('/admin/productmanagement')
    })
})

router.get('/delete-product/:id', authentication.adminverify, (req, res) => {
    let userId = req.params.id
    productController.deleteProduct(userId)
    res.redirect('/admin/productmanagement')
})

router.get('/edit-product/:id', authentication.adminverify, async (req, res) => {
    let userId = req.params.id
    let categories = await productController.findCategory()
    productController.updateProduct(userId).then((data) => {
        res.render('admin/edit-product', { data, categories, title: 'Edit Product' })
    })
})

router.post('/edit-product/:id', authentication.adminverify, (req, res) => {
    let { body } = req
    let id = req.params.id
    productController.updatedProduct(body, id).then((data) => {
        let Image = req.files.image
        // console.log(data);
        Image.mv(`public/product-image/${data}.jpg`, (err, done) => {
            if (!err) {
                res.redirect('/admin/productmanagement')
            }
        })
    })
})

router.get('/userMangement', authentication.adminverify, async (req, res) => {
    let data = await User.find().sort({ _id: -1 })
    res.render('admin/adDashUserManage', { data, title: 'User Management' })
})

router.get('/block-user/:id', async (req, res) => {
    let userId = req.params.id
    userController.blockUser(userId).then((data) => {
        return new Promise(async (resolve, reject) => {
            await User.findOne({ _id: data._id }).then((udata) => {

                if (udata.blocked === true) {
                    res.clearCookie('token')
                }
                res.redirect('/admin/userMangement')
            })
        })


    })
})

router.get('/unblock-user/:id', (req, res) => {
    let userId = req.params.id
    userController.unblockUser(userId).then((data) => {
        res.redirect('/admin/userMangement')
    })
})

router.get('/category', authentication.adminverify, (req, res) => {
    categoryControler.findcategoryAdmin().then((data) => {
        // console.log(data);
        res.render('admin/category', { data, title: 'Category' })
    })
})

// router.get('/add-category', authentication.adminverify, (req, res) => {
//     res.render('admin/add-category',{catError:''})
// })

router.post('/add-category', authentication.adminverify, async (req, res) => {
    let { name, offer } = req.body
    console.log(name, offer);
    let data = await categoryControler.recheckCat(name)
    if (data) {
        console.log('im here');
        res.json({ status: false })
    } else {
        categoryControler.addCategory(name, offer).then((data) => {
            console.log(data);
            res.json(data)
        })
    }

})

router.patch('/edit-category-coupon/:id', authentication.adminverify, async (req, res) => {
    try {
        console.log(req.body);
        let id = req.params.id
        console.log(id);
        let { offer } = req.body
        await categoryControler.editcoupon(offer, id).then(async (data) => {
            let cat = await categoryControler.findcategory()
            console.log(cat);
            await cat.forEach(async (element) => {
                let value = parseInt(element.price - (element.price * element.offer[0] / 100))
                console.log(value);
                await productController.addDiscountedProduct(element._id, value)
            });
            res.json(data);
        })
    } catch (error) {
        console.log(error);
    }

})

router.get('/edit-category/:id', authentication.adminverify, (req, res) => {
    let userId = req.params.id
    categoryControler.findCategory(userId).then((data) => {
        res.render('admin/edit-category', { data, catError: '', title: 'Edit Category' })
    })
})

router.post('/edit-category', authentication.adminverify, async (req, res) => {
    try {
        let { body } = req
        let { name, catId } = req.body
        console.log(req.body);
        let datas = await categoryControler.recheckCat(name)
        let data = await categoryControler.findCategory(catId)
        // let data = await Category.findOne({name:name})
        if (datas) {
            if (datas.name == name) {
                res.render('admin/edit-category', { catError: 'This category is already present', data, title: 'Edit Category' })
                // res.json({catError:'This category is already present'})
            }
        } else {
            categoryControler.updatedCategory(name, catId).then((data) => {
                res.redirect('/admin/category')
                // res.json(data)
            })
        }
    } catch (error) {
        console.log(error);
    }

})

router.get('/delete-category/:id', authentication.adminverify, (req, res) => {
    let userId = req.params.id
    categoryControler.deletecategory(userId)
    res.redirect('/admin/category')
})

router.get('/dashboard/day', authentication.adminverify, async (req, res) => {
    await Admin.findOrdersbyday().then((data) => {
        // console.log(data);
        res.json(data)
    })
})

router.get('/dashboard/week', authentication.adminverify, async (req, res) => {
    await Admin.findorderbyweek().then((data) => {
        res.json(data)
    })
})

router.get('/dashboard/month', authentication.adminverify, async (req, res) => {
    await Admin.findorderbymonth().then((data) => {
        res.json(data)
    })
})

router.get('/dashboard/catSalesReport', authentication.adminverify, (req, res) => {
    Admin.findorderbycat().then((data) => {
        res.json(data)
    })
})


/* -------------------------------admin view ordered products ------------------------------- */
router.get('/orderMangement', authentication.adminverify, order.findorders)

router.get('/cancelorder/:id', authentication.adminverify, addcart.cancelOrderAdmin)

router.post('/change-status/:id', authentication.adminverify, addcart.changestatus)

// router.get('/change-status/:id', authentication.adminverify, addcart.changestatus)

router.get('/bannermangement', authentication.adminverify, Admin.bannermange)

router.post('/banner', authentication.adminverify, Admin.addbanner)

router.get('/add-offers', authentication.adminverify, Admin.addoffer)

router.post('/add-coupon', authentication.adminverify, coupon.addcoupon)

router.patch('/deletecoupon', authentication.adminverify, coupon.deletecoupon)

router.get('/detail-view/:id', authentication.adminverify, Admin.detailview)

router.get('/viewProductDetail/:id', authentication.adminverify, admin.productDes)

router.get('/logout', authentication.adminverify, (req, res) => {
    res.clearCookie('adminToken').redirect('/admin/login')
})

module.exports = router;
