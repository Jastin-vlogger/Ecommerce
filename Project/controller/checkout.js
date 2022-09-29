const { response } = require("../app");
const userCart = require("../models/userCart");
const userHelpers = require("../services/user");
const productController = require('../services/productController');
const usedcoupon = require('../models/usedcoupon')
const couponHelpers = require('../services/coupon')
const wallet = require('../services/wallet')

module.exports = {
    proccedToCheck: async (req, res) => {
        try {
            let userId = req.userId
            console.log(req.query);
            let product = await productController.getCartProducts(userId)
            let total = await userHelpers.getTotalAmount(userId)
            let address = await userHelpers.findaddress(userId)
            let wallbalance = await userHelpers.findWallBalance(userId)
            let wall = wallbalance.wallet
            res.render('user/checkoutpage', { total, product, userId, address, wall });
        } catch (error) {
            console.log(error);
        }

    },
    placeOrder: async (req, res) => {
        let userId = req.body.userId
        let payment = req.body.paymentmethod
        console.log(req.body);
        let { coupon } = req.body
        let { couponusing } = req.body
        let products = await productController.getCartProductList(req.body.userId)
        let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
        let wallbalance = await userHelpers.findWallBalance(userId)
        let wall = wallbalance.wallet
        if (coupon) {
            totalPrice = coupon
            let couponused = await couponHelpers.findCoupon(couponusing)
            console.log(couponused);
            await couponHelpers.usedcoupon(couponused._id, userId).then((data) => {
                console.log(data);
            })
        }

        userHelpers.placeOrder(req.body, products, totalPrice, userId).then(async(orderId) => {
            if (payment == 'COD') {
                res.json({ cod_sucess: true });
            } else if (payment == 'Razorpay') {
                console.log('da kutta');
                userHelpers.generateRazorPay(orderId, totalPrice).then((response) => {
                    res.json(response);
                    console.log(response);
                })
            } else if (payment == 'Paypal') {
                console.log(req.body)
                console.log('im here');
                userHelpers.generatePaypal(orderId, totalPrice).then(async (response) => {
                    await userHelpers.changePaymentStatusPaypal(orderId)
                    res.json({ paypal: true })
                })
            } else {
                console.log('hi im wallet');
                let reduceWallBalance =   wall -totalPrice;
                 let a = await wallet.refundForOnline(reduceWallBalance,userId)
                userHelpers.changePaymentStatusPaypal(orderId).then((response)=>{
                    res.json({wallet:true})
                })

            }
        })
    },
    orderplaced: (req, res) => {
        res.render('user/orderplaced')
    },
    viewproducts: async (req, res) => {
        let userId = req.userId
        const token = req.cookies.token
        let orders = await productController.getUserOrders(userId)
        res.render('user/oderdetails', { orders })
    },
    verifyingOrder: (req, res) => {
        userHelpers.verifyPayment(req.body).then(() => {
            userHelpers.changePaymentStatus(req.body.order.receipt).then(() => {
                console.log("successfull");
                res.json({ status: true })
            })
        }).catch((err) => {
            res.json({ status: false, errMsg: err })
        })
        // res.redirect('/order-placed');
    }
}