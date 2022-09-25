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
        let payment = req.body.paymentmethod
        let products = await productController.getCartProductList(req.body.userId)
        let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
        userHelpers.placeOrder(req.body,products,totalPrice,userId).then((orderId)=>{
            if (payment == 'COD') {
                 res.json({cod_sucess:true});
            } else if(payment == 'Razorpay'){
                console.log('da kutta');
                userHelpers.generateRazorPay(orderId,totalPrice).then((response)=>{
                    res.json(response);
                    console.log(response);
                })
            } else if(payment == 'Paypal'){
                console.log(req.body)
                console.log('im here');
                userHelpers.generatePaypal(orderId,totalPrice).then(async(response)=>{  
                    await userHelpers.changePaymentStatusPaypal(orderId)
                    res.json({paypal:true})
                })
            }
        })
    },
    orderplaced:(req,res)=>{
        res.render('user/orderplaced')
    },
    viewproducts:async(req,res)=>{ 
    let userId = req.userId
    const token = req.cookies.token
    let orders =await productController.getUserOrders(userId)
    res.render('user/oderdetails',{orders})
    },
    verifyingOrder:(req,res)=>{
        userHelpers.verifyPayment(req.body).then(()=>{
            userHelpers.changePaymentStatus(req.body.order.receipt).then(()=>{
                console.log("successfull");
                res.json({status:true})
            })
        }).catch((err)=>{
            res.json({status:false,errMsg:err})
        })
        // res.redirect('/order-placed');
    }
}