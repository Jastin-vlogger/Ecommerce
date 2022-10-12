const productController = require('../services/productController');
const userAuth = require('../authMiddleWare/auth')
const productcontroller = require('../services/productController');
const { response } = require('../app');
const userHelpers = require('../services/user');
const User = require('../models/user');
const { Types } = require('mongoose');
const bcrypt = require('bcrypt')
const Category = require('../models/category')
const order = require('../services/orders')
const wallet = require('../services/wallet')


module.exports = {
  addtocart: async (req, res) => {
    try {
      let userId = req.userId
      const token = req.cookies.token
      if (token) {
        let productId = req.params.id
        console.log(userId, productId);
        await productcontroller.addToCart(productId, userId).then((response) => {
          res.json(response)
        })
      } else {
        res.json({ status: false })
      }
    } catch (error) {
      console.log(error);
    }

  },
  cart: async (req, res) => {
    try {
      const token = req.cookies.token
      if (token) {
        let userId = req.userId
        let total = await userHelpers.getTotalAmount(userId)
        let eachTotal = await userHelpers.getEachProductAmount(userId)
        let cartCount = await userHelpers.getCartCount(userId)
        let product = await productController.getCartProducts(userId)
        let categories = await productController.findCategory()
        console.log(total);
        res.render('user/cart', { product, token, userId, total, eachTotal, cartCount, categories });
      } else {
        res.redirect('/login')
      }
    } catch (error) {
      console.log(error);
    }
  },
  changeQuantity: async (req, res) => {
    try {
      let { cart, product, count, quantity, user } = req.body
      console.log(cart, product, count, quantity);
      userHelpers.changeProductQuantity(cart, product, count, quantity).then(async (response) => {
        response.total = await userHelpers.getTotalAmount(user)
        res.json(response)
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  deleteProduct: (req, res) => {
    try {
      let userId = req.userId
      let prodId = req.params.id
      let cartdelete = productController.deleteCart(prodId, userId)
      res.redirect('/cart')
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  profile: async (req, res) => {
    try {

      let userId = req.userId
      if (userId) {
        const token = req.cookies.token
        let cartCount = await userHelpers.getCartCount(userId)
        let categories = await productController.findCategory()
        let user = await userHelpers.viewprofile(userId)

        let addedAddress = await userHelpers.findaddress(userId)

        res.render('user/profile', { user, addedAddress, cartCount, token, categories })
      } else {
        res.redirect('/login')
      }
    } catch (error) {
      console.log(error);
    }


  },
  viewproductdetail: async (req, res) => {
    try {
      let orderId = req.params.id
      let product = await productController.getOrderProducts(orderId)
      // console.log(product);
      res.json(product)
      // res.render('user/vieworders', { product })
    } catch (error) {
      console.log(error);
    }

  },
  cancelOrder: async (req, res) => {
    try {
      let userId = req.userId
      let orderId = req.params.id

      // finding the order is it online and refunding
      let isonline = await order.findIsOrderOnline(orderId)
      console.log(isonline);
      if (isonline.paymentMethod == 'Paypal' || isonline.paymentMethod == 'Razorpay') {
        let wallAmountInUserWall = await wallet.findwallet(userId)
        let totalToAdd = wallAmountInUserWall.wallet + isonline.totalAmount
        let wall = await wallet.refundForOnline(totalToAdd, userId)
        console.log(wall)
      }
      let ordercanceled = await productController.cancelOrder(orderId)
      let orders = await productController.getUserOrders(userId)
      res.redirect('/orders')
    } catch (error) {
      console.log(error);
      throw new Error(error)
    }

  },
  cancelOrderAdmin: async (req, res) => {
    try {
      let orderId = req.params.id
      let ordercanceled = await productController.cancelOrderadmin(orderId)
      res.redirect('/admin/orderMangement')
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  changestatus: async (req, res) => {
    try {
      let orderId = req.params.id
      let status = await productController.changeOrderStatus(orderId, req.body.status)
      res.redirect('/admin/orderMangement')
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  saveaddress: async (req, res) => {
    try {
      let { firstname, lastname, address, town, state, pincode } = req.body
      let userId = req.userId
      await productController.addAddress(firstname, lastname, address, town, state, pincode, userId).then((data) => {
        res.json(data)
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }


  },
  address: async (req, res) => {
    try {
      const token = req.cookies.token
      let userId = req.userId
      let cartCount = await userHelpers.getCartCount(userId)
      let categories = await productController.findCategory()
      let addedAddress = await userHelpers.findaddress(userId)
      res.render('user/address', { addedAddress, token, cartCount, categories })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  removeAddress: async (req, res) => {
    try {
      let addressId = req.params.userId
      await productController.removeAddress(addressId).then((data) => {
        res.redirect('/profile')
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  edituser: async (req, res) => {
    try {
      const token = req.cookies.token
      let userId = req.userId
      let cartCount = await userHelpers.getCartCount(userId)
      let categories = await productController.findCategory()
      return new Promise(async (resolve, reject) => {
        let user = await User.findById({ _id: Types.ObjectId(userId) })
        console.log(user);
        res.render('user/edituser', { user, token, cartCount, categories })
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  updateuser: async (req, res) => {
    try {
      let { email, firstName, lastName } = req.body
      let userId = req.userId
      return new Promise(async (resolve, reject) => {
        let updatedUser = await User.updateOne({ _id: Types.ObjectId(userId) }, {
          $set: {
            email: email,
            firstName: firstName,
            lastName: lastName,
          }
        })
        res.redirect("/profile")
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  changepassword: async (req, res) => {
    try {
      const token = req.cookies.token
      let userId = req.userId
      let cartCount = await userHelpers.getCartCount(userId)
      let categories = await productController.findCategory()
      res.render('user/changePassword', { passwordError: '', cartCount, categories, token })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  updatepassword: async (req, res) => {
    try {
      let { lastpassword, newpassword } = req.body;
      console.log(lastpassword, newpassword);
      console.log(req.body);
      let userId = req.userId
      userHelpers.updatepassword(lastpassword, newpassword, userId).then(async (data) => {
        if (data.status == false) {
          res.render('user/changePassword', { passwordError: 'Enter correct password' })
        } else {
          await bcrypt.hash(newpassword, 10).then(async (hashed) => {
            await User.findByIdAndUpdate({ _id: Types.ObjectId(userId) }, { $set: { password: hashed } })
            res.redirect('/profile')
          })
        }
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  categorize: async (req, res) => {
    try {
      let categoryId = req.params.id
      const token = req.cookies.token
      let userId = req.userId
      let categories = await productController.findCategory()
      let cartCount = await userHelpers.getCartCount(userId)
      let catname = await Category.findById(categoryId)
      // console.log(catname.name);
      let data = await productController.categorizeProduct(catname.name)
      console.log('data :' + data);
      res.render('user/category', { data, token, cartCount, categories })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  whislist: async (req, res) => {
    try {
      let userId = req.userId
      if (userId) {
        // let total = await userHelpers.getTotalAmount(userId)
        // let eachTotal = await userHelpers.getEachProductAmount(userId)
        let product = await productController.getwishlistProducts(userId)
        const token = req.cookies.token
        let cartCount = await userHelpers.getCartCount(userId)
        let categories = await productController.findCategory()
        // console.log(product);
        res.render('user/whislist', { product, token, cartCount, categories })
      } else {
        res.redirect('/login')
      }

    } catch (error) {
      console.log(error);
    }
  },
  addtowhish: async (req, res) => {
    try {
      let userId = req.userId
      let productId = req.params.id
      console.log(userId, productId);
      await productcontroller.addTowhishlist(productId, userId).then((response) => {
        console.log(response);
        res.json(response)
        // res.redirect('/');
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }


  },
  deleteWishPro: async (req, res) => {
    try {
      let userId = req.userId
      let productId = req.params.id
      await productcontroller.deleteWishProduct(productId, userId).then((response) => {
        console.log(response);
        res.redirect('/wishlist')
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  category: async (req, res) => {
    try {
      let productId = req.params.id
      let userId = req.userId
      const token = req.cookies.token
      let cartCount = await userHelpers.getCartCount(userId)
      let categories = await productController.findCategory()
      productController.productDetails(productId).then((data) => {
        console.log(data);
        res.render('user/productDetails', { data, cartCount, token, categories })
      })
    } catch (error) {
      console.log(error);
      res.redirect('/error')
    }

  },
  proDetailCatwise: async (req, res) => {
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
  },


}



