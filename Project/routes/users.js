var express = require('express');
var router = express.Router();
const User = require('../models/user')
const userHelpers = require('../controllers/user-helpers')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const userAuth = require('../authMiddleWare/auth')
const productController = require('../controllers/productController');
const addcart = require('../controllers/add-to-cart')
const checkout = require('../controllers/checkout');
const { render } = require('../app');

const serverSID ='VAbeb462e425477ecf42eee83cf5093c52' 
const accountSID = 'AC674a3db162fadea27864cc9da3b8120b'
const authtoken = '02ba0b322f85a0307e8c82d32494e5ed'
const client = require('twilio')(accountSID,authtoken)


/* GET users listing. */
router.get('/',userAuth.verify,async(req, res)=> {
  const token = req.cookies.token
  let userId = req.userId
  let cartCount =await userHelpers.getCartCount(userId)
  productController.getAllProducts().then((allProduct)=>{
    res.render('user/landingPage',{allProduct,token,cartCount})
  })
});

router.get('/productDetails/:id',userAuth.verify,async(req,res)=>{
  let productId = req.params.id
  let userId = req.userId
  const token = req.cookies.token
  let cartCount =await userHelpers.getCartCount(userId)
  productController.productDetails(productId).then((data)=>{
    console.log(data);
  res.render('user/productDetails',{data,cartCount,token})
  })
})

router.get('/login',userAuth.userLoggedIn,(req,res)=>{
  res.render('user/login',{passwordError:" ",nameval:'',eamilError:''})
})

router.post('/login',(req,res)=>{
  let {email} = req.body
  userHelpers.loginValidate(req.body).then((data)=>{
    if (data.status == true){
      //the important part
        userHelpers.findUser(req.body.email).then((userdata)=>{
        const token = jwt.sign({userdata},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"7d"})
          res.cookie('token',token,{
          httpOnly:true,
        })
        res.redirect('/')
      })
    }else if(data == "blocked"){
      res.clearCookie('token');
      res.render('user/login',{passwordError:"You are Blocked",nameval:email,eamilError:''})
    }else if(data.status == false){
      res.render('user/login',{passwordError:"Enter valid password",nameval:email,eamilError:''})
    }else if(data){
      res.render('user/login',{eamilError:'Enter valid Email',passwordError:'',nameval:''})
    }
  })
})


router.get('/getOtp',userAuth.userLoggedIn,(req,res)=>{
  res.render('user/otppage')
})


router.post('/sendotp',(req,res)=>{
  try{
    client.verify
  .services(serverSID)
  .verifications.create({
    to:`+91${req.body.number}`,
    channel:'sms'
  })
  } catch(err) {
    console.log(err)
  }
  res.render('user/checkOtp',{number: req.body.number})
})


router.post('/checkotp',(req,res)=>{
  const {otp,number} = req.body
  try{
    client.verify.services(serverSID).verificationChecks.create({to:`+91${number}`,code:otp}).then((resp)=>{  
      if (!resp.valid) {
        res.render('user/checkOtp',{otperror: 'Enter valid OTP'})
      } else {
         res.redirect('/');
      }
      
   })
  } catch(err) {
    console.log(err+"hoi this is error")
  }
})

router.get('/signup',userAuth.userLoggedIn,(req,res)=>{
  res.render('user/signup',{eamilNotFound:''})
})
router.post('/signup',(req,res)=>{
  let {body}=req
  userHelpers.signUp(body).then((data)=>{
    if(data == 'email found'){
      res.render('user/signup',{eamilNotFound:'Email already exists'})
    }
    res.redirect('/login')
  }) 
})



router.get('/add-to-cart/:id',userAuth.userLoggedIn,addcart.addtocart)

router.get('/cart',userAuth.userLoggedIn,addcart.cart)

router.post('/change-product-quantity',userAuth.userLoggedIn,addcart.changeQuantity)

/* ------------------------------- delete cart product ------------------------------- */
router.get('/deleteCartProduct/:id',userAuth.userLoggedIn,addcart.deleteProduct)

router.get('/proccedToCheckOut',userAuth.userLoggedIn,checkout.proccedToCheck)

/* ------------------------------- placing order ------------------------------- */
router.post('/place-order',userAuth.userLoggedIn,checkout.placeOrder)

router.post('/verify-payment',userAuth.userLoggedIn,checkout.verifyingOrder)

router.get('/order-placed',userAuth.userLoggedIn,checkout.orderplaced)

/* ------------------------------- view ordered products ------------------------------- */
router.get('/orders',userAuth.userLoggedIn,checkout.viewproducts)

/* ------------------------------- profile ------------------------------- */
router.get('/profile',userAuth.userLoggedIn,addcart.profile)

/* ------------------------------- save address ------------------------------- */
router.post('/saveaddress',userAuth.userLoggedIn,addcart.saveaddress)

/* ------------------------------- address page ------------------------------- */
router.get('/address',userAuth.userLoggedIn,addcart.address)

/* ------------------------------- remove address ------------------------------- */
router.get('/removeaddress/:id',userAuth.userLoggedIn,addcart.removeAddress)

/* ------------------------------- cancel order ------------------------------- */
router.get('/cancel-order/:id',userAuth.userLoggedIn,addcart.cancelOrder)

/* ------------------------------- view ordered product detail ------------------------------- */
router.get('/product/:id',userAuth.userLoggedIn,addcart.viewproductdetail)

/* ------------------------------- edit get ------------------------------- */
router.get('/edituser',userAuth.userLoggedIn,addcart.edituser)

/* ------------------------------- edit post ------------------------------- */
router.post('/editprofile',userAuth.userLoggedIn,addcart.updateuser)

/* ------------------------------- changepassword ------------------------------- */
router.get('/changepassword',userAuth.userLoggedIn,addcart.changepassword)

/* -------------------------------  post change password ------------------------------- */
router.post('/updatepassword',userAuth.userLoggedIn,addcart.updatepassword)

router.get('/address',userAuth.userLoggedIn,addcart.address)

/* ------------------------------- logout ------------------------------- */
router.get('/logout',userAuth.verify,(req,res)=>{
    res.clearCookie('token').redirect('/login')
})

 
module.exports = router;
