const productController = require('./productController');
const userAuth = require('../authMiddleWare/auth')
const productcontroller = require('./productController');
const { response } = require('../app');
const userHelpers = require('./user-helpers');
const User = require('../models/user');
const { Types } = require('mongoose');
const bcrypt = require('bcrypt')


module.exports = {
addtocart :async(req,res)=>{
    let userId = req.userId
    let productId = req.params.id
    console.log(userId,productId);
    await productcontroller.addToCart(productId,userId).then((response)=>{
        res.redirect('/');
    })
  },
  cart:async(req,res)=>{
    let userId = req.userId
    const token = req.cookies.token
    console.log(userId);
    let total = await userHelpers.getTotalAmount(userId)
    let eachTotal = await userHelpers.getEachProductAmount(userId)
    let product =await productController.getCartProducts(userId)
    res.render('user/cart',{product,token,userId,total,eachTotal});
    
  },
  changeQuantity:async(req,res)=>{
    let {cart ,product,count,quantity,user} = req.body
    console.log(cart ,product,count ,quantity);
    userHelpers.changeProductQuantity(cart ,product,count,quantity).then(async(response)=>{
      response.total = await userHelpers.getTotalAmount(user)
      res.json(response)
    })
  },
  deleteProduct:(req,res)=>{
    let userId = req.userId
    let prodId = req.params.id
    let cartdelete = productController.deleteCart(prodId,userId)
    res.redirect('/cart')
  },
  profile:async(req,res)=>{
    let userId = req.userId
    let user = await userHelpers.viewprofile(userId)
    let addedAddress =await userHelpers.findaddress(userId)
    res.render('user/profile',{user,addedAddress})
  },
  viewproductdetail:async(req,res)=>{
    let orderId = req.params.id
    let product = await productController.getOrderProducts(orderId)
    console.log(product);
    res.render('user/vieworders',{product})
  },
  cancelOrder:async(req,res)=>{
    let userId = req.userId
    let orderId = req.params.id
    let ordercanceled = await productController.cancelOrder(orderId)
    let orders =await productController.getUserOrders(userId)
    console.log(orders);
    // res.render('user/oderdetails',{orders})
    res.redirect('/orders')

  },
  cancelOrderAdmin:async(req,res)=>{
    let orderId = req.params.id
    let ordercanceled = await productController.cancelOrderadmin(orderId)
    res.redirect('/admin/orderMangement')
  },
  changestatus:async(req,res)=>{
    let orderId = req.params.id
    let status = await productController.changeOrderStatus(orderId)
    res.redirect('/admin/orderMangement')
  },
  saveaddress:async(req,res)=>{
    let {firstname,lastname,address,town,state,pincode}=req.body
    let userId = req.userId
    await productController.addAddress(firstname,lastname,address,town,state,pincode,userId).then((data)=>{
      res.redirect('/profile')
    })
    
  },
  address:async(req,res)=>{
    let userId = req.userId
    let addedAddress =await userHelpers.findaddress(userId)
    res.render('user/address',{addedAddress})
  },
  removeAddress:async(req,res)=>{
    let addressId = req.params.userId
    await productController.removeAddress(addressId).then((data)=>{
      res.redirect('/profile')
    })
  },
  edituser:async(req,res)=>{
    let userId = req.userId
    return new Promise(async(resolve,reject)=>{
      let user = await User.findById({_id:Types.ObjectId(userId)})
      console.log(user);
      res.render('user/edituser',{user})
    })
  },
  updateuser:async(req,res)=>{
    let {email,firstName,lastName} = req.body
    let userId = req.userId
    return new Promise (async(resolve,reject)=>{
      let updatedUser = await User.updateOne({_id:Types.ObjectId(userId)},{$set:{
        email:email,
        firstName:firstName,
        lastName:lastName,
      }})
      res.redirect("/profile")
    })
  },
  changepassword:(req,res)=>{
    res.render('user/changePassword',{passwordError:''})
  },
  updatepassword:async(req,res)=>{
    let {lastpassword,newpassword} = req.body;
    console.log(lastpassword,newpassword);
    console.log(req.body);
    let userId = req.userId
    userHelpers.updatepassword(lastpassword,newpassword,userId).then(async(data)=>{
      if (data.status == false) {
        res.render('user/changePassword',{passwordError:'Enter correct password'})
      } else {
        await bcrypt.hash(newpassword,10).then(async(hashed)=>{
        await User.findByIdAndUpdate({_id:Types.ObjectId(userId)},{$set:{password:hashed}})
        res.redirect('/profile')
        }) 
      }
    })
  }

}



