var express = require('express');
var router = express.Router();
const User = require('../models/user')
const userHelpers = require('../services/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const userAuth = require('../authMiddleWare/auth')
const productController = require('../services/productController');
// const product = require('../services/product')
const product = require('../controller/product')
const checkout = require('../controller/checkout');
const { render } = require('../app');
const paypal = require('paypal-rest-sdk');
const Banner = require('../services/admin');
const banner = require('../models/banner');
const coupon = require('../controller/coupon');
const user = require('../controller/user')



/* GET users listing. */
router.get('/', userAuth.verify, async (req, res) => {
  const token = req.cookies.token
  let userId = req.userId
  let cartCount = await userHelpers.getCartCount(userId)
  let categories = await productController.findCategory()
  let bannerdata = await banner.find()
  let allProduct = await productController.getAllProducts()
  // let all = await productController.finde()
  // console.log(all);
  res.render('user/landingPage', { allProduct, token, cartCount, categories, bannerdata })
});

router.get('/productDetails/:id', userAuth.verify, async (req, res) => {
  try {
    let productId = req.params.id
    let userId = req.userId
    const token = req.cookies.token
    let categories = await productController.findCategory()
    let cartCount = await userHelpers.getCartCount(userId)
    let data = await productController.productDetails(productId)
    console.log(data);
    res.render('user/productDetails', { data, cartCount, token, categories })
  } catch (error) {
    console.log(error);
    throw new (error)
  }
})

router.get('/products/categories/productDetails/:id', userAuth.verify, async (req, res) => {
  let productId = req.params.id
  let userId = req.userId
  const token = req.cookies.token
  let cartCount = await userHelpers.getCartCount(userId)
  let categories = await productController.findCategory()
  productController.productDetails(productId).then((data) => {
    console.log(data);
    res.render('user/productDetails', { data, cartCount, token, categories })
  })
})

router.get('/login', userAuth.userLoggedIn, (req, res) => {
  res.render('user/login', { passwordError: " ", nameval: '', eamilError: '' })
})

router.post('/login', (req, res) => {
  try {
    let { email } = req.body
    userHelpers.loginValidate(req.body).then((data) => {
      if (data.status == true) {
        //the important part
        userHelpers.findUser(req.body.email).then((userdata) => {
          const token = jwt.sign({ userdata }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
          res.cookie('token', token, {
            httpOnly: true,
          })
          res.redirect('/')
        })
      } else if (data == "blocked") {
        res.clearCookie('token');
        res.render('user/login', { passwordError: "You are Blocked", nameval: email, eamilError: '' })
      } else if (data.status == false) {
        res.render('user/login', { passwordError: "Enter valid password", nameval: email, eamilError: '' })
      } else if (data) {
        res.render('user/login', { eamilError: 'Enter valid Email', passwordError: '', nameval: '' })
      }
    })
  } catch (error) {
    console.log(error);
    throw new Error(' Authentication failed')
  }

})


router.get('/getOtp', userAuth.userLoggedIn, (req, res) => {
  res.render('user/otppage',{ number: ''})
})


router.post('/sendotp', user.loginOtp)

router.post('/checkotp', user.loginotpcheck)

router.get('/signup', userAuth.userLoggedIn, (req, res) => {
  res.render('user/signup', { eamilNotFound: '', referalError: '' })
})
router.post('/signup', (req, res) => {
  let { body } = req
  userHelpers.signUp(body).then((data) => {
    if (data == 'email found') {
      res.render('user/signup', { eamilNotFound: 'Email already exists', referalError: '' })
    } else if (data == 'invalid referal') {
      res.render('user/signup', { referalError: 'please check the referral', eamilNotFound: '' })
    } else {
      res.redirect('/login')
    }
  })
})

router.get('/products/categories/:id', product.categorize)

router.get('/add-to-cart/:id', userAuth.userLoggedIn, product.addtocart)

router.get('/cart', userAuth.userLoggedIn, product.cart)

router.post('/change-product-quantity', userAuth.userLoggedIn, product.changeQuantity)

/* ------------------------------- delete cart product ------------------------------- */
router.get('/deleteCartProduct/:id', userAuth.userLoggedIn, product.deleteProduct)

router.get('/wishlist', userAuth.userLoggedIn, product.whislist)

router.get('/add-to-whislist/:id', userAuth.userLoggedIn, product.addtowhish)

router.get('/wishlist-product/:id', userAuth.userLoggedIn, product.deleteWishPro)

router.get('/proccedToCheckOut', userAuth.userLoggedIn, checkout.proccedToCheck)


/* ------------------------------- placing order ------------------------------- */
router.post('/place-order', userAuth.userLoggedIn, checkout.placeOrder)

router.post('/verify-payment', userAuth.userLoggedIn, checkout.verifyingOrder)

router.get('/order-placed', userAuth.userLoggedIn, checkout.orderplaced)

/* ------------------------------- view ordered products ------------------------------- */
router.get('/orders', userAuth.userLoggedIn, checkout.viewproducts)

/* ------------------------------- cancel order ------------------------------- */
router.get('/cancel-order/:id', userAuth.userLoggedIn, product.cancelOrder)

/* ------------------------------- profile ------------------------------- */
router.get('/profile', userAuth.userLoggedIn, product.profile)

/* ------------------------------- save address ------------------------------- */
router.post('/saveaddress', userAuth.userLoggedIn, product.saveaddress)

/* ------------------------------- address page ------------------------------- */
router.get('/address', userAuth.userLoggedIn, product.address)

/* ------------------------------- remove address ------------------------------- */
router.get('/removeaddress/:id', userAuth.userLoggedIn, product.removeAddress)

/* ------------------------------- view ordered product detail ------------------------------- */
router.get('/product/:id', userAuth.userLoggedIn, product.viewproductdetail)

/* ------------------------------- edit get ------------------------------- */
router.get('/edituser', userAuth.userLoggedIn, product.edituser)

/* ------------------------------- edit post ------------------------------- */
router.post('/editprofile', userAuth.userLoggedIn, product.updateuser)

/* ------------------------------- changepassword ------------------------------- */
router.get('/changepassword', userAuth.userLoggedIn, product.changepassword)

/* -------------------------------  post change password ------------------------------- */
router.post('/updatepassword', userAuth.userLoggedIn, product.updatepassword)

router.get('/address', userAuth.userLoggedIn, product.address)

router.post('/checkpromo', userAuth.userLoggedIn, coupon.checkcoupon)

/* ------------------------------- logout ------------------------------- */
router.get('/logout', userAuth.verify, (req, res) => {
  res.clearCookie('token').redirect('/login')
})

module.exports = router;
