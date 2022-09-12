const { response } = require("../app");
const userCart = require("../models/userCart");
const userHelpers = require("./user-helpers");
const productController = require('./productController');


module.exports ={
    proccedToCheck:async(req,res)=>{
        let userId = req.userId
        let product =await productController.getCartProducts(userId)
        let total = await userHelpers.getTotalAmount(userId)
        let address = await userHelpers.findaddress(userId)
        res.render('user/checkoutpage',{total,product,userId,address});   
    },
    placeOrder:async(req,res)=>{
        let userId = req.body.userId
        let products = await productController.getCartProductList(req.body.userId)
        let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
        userHelpers.placeOrder(req.body,products,totalPrice,userId).then((response)=>{
            res.send(response)
        })
        console.log(req.body);
    },
    orderplaced:(req,res)=>{
        res.render('user/orderplaced')
    },
    viewproducts:async(req,res)=>{ 
    let userId = req.userId
    const token = req.cookies.token
    let orders =await productController.getUserOrders(userId)
    res.render('user/oderdetails',{orders})
    }
}