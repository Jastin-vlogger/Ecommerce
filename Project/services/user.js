const User = require('../models/user')
const bcrypt = require('bcrypt')
const Cart = require('../models/userCart')
const Order = require('../models/order')
const { Types, default: mongoose } = require('mongoose')
const Address = require('../models/address')
const Razorpay = require('razorpay')
const { resolve } = require('path')
const { findByIdAndUpdate } = require('../models/user')
const crypto = require('crypto')
const paypal = require('paypal-rest-sdk');
const Coupon = require('../models/coupon')
const Usedcoupon = require('../models/usedcoupon')
const shortid = require('shortid');


let instance = new Razorpay({
    key_id: 'rzp_test_kC80uilJbJoVnc',
    key_secret: 'p6rVgBY913W6XmR7IatJHFqe',
});


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVeSbZLSKoF5tArrQWsc49IuZwh7iFt9O7TLu84WpFcaWTY7rVG132U0ug9i1hSObq_Tt73PsdtdbKLt',
    'client_secret': 'ECa9hIwI7SFkA1uzkrozydGxpreGq7Tf-noWqFNTLQXaHpYDGJey4USkLGcWzZ2ZqZyQTf-bMqPGVDAh'
});


module.exports = {
    signUp: (userData) => {
        try {
            let { referal } = userData
            console.log(userData);
            return new Promise(async (resolve, reject) => {
                let user = await User.findOne({ email: userData.email })
                let refer = 'a';
                if (referal) {
                    refer = await User.findOne({ referral_code: referal })
                }
                if (refer) {
                    let value = 500;
                    let val = refer.wallet + value;
                    await User.findByIdAndUpdate({ _id: Types.ObjectId(refer._id) }, { $set: { wallet: val } })
                }
                if (user) {
                    resolve('email found')
                } else if (!refer) {
                    // console.log('invalid');
                    resolve('invalid referal')
                } else {

                    /* a unique referral code the user can share */
                    let referral_code = shortid.generate();
                    let { firstName, lastName, email, number, password, referal } = userData
                    let data = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        number: number,
                        referal: referal,
                        referral_code: referral_code,
                    }
                    userData.password = await bcrypt.hash(userData.password, 10)
                    await new User(data).save().then((data) => {
                        resolve(data)
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }

    },
    loginValidate: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await User.findOne({ email: userData.email })
            let response = {}
            if (user) {
                if (user.blocked) {
                    resolve("blocked")
                } else {
                    bcrypt.compare(userData.password, user.password).then((status) => {
                        if (status) {
                            response.user = user
                            response.status = true;
                            resolve(response)
                        } else {
                            resolve({ status: false })
                        }
                    })
                }
            } else {
                resolve(userData)
            }
        })
    },
    blockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            await User.findByIdAndUpdate({ _id: id }, { $set: { blocked: true } }).then((data) => {
                resolve(data)
            })
        })
    },
    unblockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            await User.findByIdAndUpdate({ _id: id }, { $set: { blocked: false } }).then((data) => {
                resolve(data)
            })
        })
    },
    findUser: (email) => {
        return new Promise(async (resolve, reject) => {
            await User.findOne({ email: email }).then((data) => {
                resolve(data)
            })
        })
    },
    getCartCount: (userid) => {
        console.log(userid);
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await Cart.findOne({ user: Types.ObjectId(userid) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },
    changeProductQuantity: (cartId, productId, count, quantity) => {
        console.log(cartId, productId, count, quantity);
        count = parseInt(count)
        return new Promise(async (resolve, reject) => {
            if (count == -1 && quantity == 1) {
                await Cart.updateOne({ '_id': Types.ObjectId(cartId) },
                    {
                        $pull: { products: { item: Types.ObjectId(productId) } }
                    }).then((response) => {
                        resolve({ removeProduct: true })
                    })
            } else {
                await Cart.updateOne({ '_id': Types.ObjectId(cartId), 'products.item': Types.ObjectId(productId) },
                    {
                        $inc: { 'products.$.quantity': count }
                    }
                ).then((response) => {
                    resolve({ status: true })
                })
            }
        })
    },
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await Cart.aggregate([{
                $match: { user: mongoose.Types.ObjectId(userId) }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    product: { $arrayElemAt: ['$product', 0] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ['$quantity', '$product.discountedPrice'] } }
                }
            }

            ])
            if (total[0]) {
                resolve(total[0].total)
            } else {
                resolve('cart is empty')
            }

        })
    },
    getEachProductAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await Cart.aggregate([{
                $match: { user: mongoose.Types.ObjectId(userId) }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    product: { $arrayElemAt: ['$product', 0] }
                }
            },
            {
                $project: {
                    total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                }
            }

            ])
            console.log(total);
            resolve(total)
        })
    },
    placeOrder: (order, products, total, userId) => {
        return new Promise(async (resolve, reject) => {
            let status = order.paymentmethod === 'COD' ? 'placed' : 'pending'
            let ordersave = {
                deliveryDetails: {
                    address: order.address,
                    state: order.state,
                    pincode: order.pincode
                },
                userId: Types.ObjectId(order.userId),
                paymentMethod: order.paymentmethod,
                products: products,
                status: status,
                totalAmount: total,
                date: new Date()
            }
            await new Order(ordersave).save().then(async (response) => {
                await Cart.deleteOne({ user: Types.ObjectId(userId) })
                console.log(response._id + "this is the oderId");
                resolve(response._id)
            })
        })
    },
    generateRazorPay: (orderId, totalPrice) => {
        return new Promise((resolve, reject) => {
            instance.orders.create({
                amount: totalPrice * 100,
                currency: "INR",
                receipt: '' + orderId,
                notes: {
                    key1: "value3",
                    key2: "value2"
                }
            }, (err, order) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    resolve(order)
                }

            })
        })
    },
    verifyPayment: async (details) => {
        return new Promise(async (resolve, reject) => {
            console.log(details.payment.razorpay_order_id);
            const { createHmac } = await import('node:crypto');
            let hmac = createHmac('sha256', 'p6rVgBY913W6XmR7IatJHFqe');
            hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id);
            hmac = hmac.digest('hex')
            if (hmac == details.payment.razorpay_signature) {
                resolve()
            } else {
                reject()
            }
        })
    },
    changePaymentStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await Order.updateOne({ _id: Types.ObjectId(orderId) }, { $set: { status: 'placed' } }).then(() => {
                resolve()
            })
        })

    },
    changePaymentStatusPaypal: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await Order.updateOne({ _id: Types.ObjectId(orderId) }, { $set: { status: 'placed' } }).then(() => {
                resolve()
            })
        })
    },
    generatePaypal: (orderId, totalPrice) => {
        parseInt(totalPrice).toFixed(2)
        // console.log(totalPrice);
        return new Promise(async (resolve, reject) => {
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3000/success",
                    "cancel_url": "http://localhost:3000/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "Red Sox Hat",
                            "sku": "001",
                            "price": totalPrice,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": totalPrice
                    },
                    "description": "Hat "
                }]
            };

            let data = paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    console.log(error, 'error ahda kuta');
                    throw error;
                } else {
                    console.log('payment ayiiii');
                    resolve(payment)
                }
            })

        })
    },
    vieworders: () => {

    },
    viewprofile: (userId) => {
        return new Promise(async (resolve, reject) => {
            let user = await User.findById(userId)
            resolve(user)
        })
    },
    findaddress: async (userId) => {
        return new Promise(async (resolve, reject) => {
            await Address.find({ userId: Types.ObjectId(userId) }).then((response) => {
                resolve(response)
            })
        })

    },
    updatepassword: async (lastpassword, firstpassword, Id) => {
        return new Promise(async (resolve, reject) => {
            let user = await User.findById(Types.ObjectId(Id))
            console.log(user);
            let response = {}
            if (user) {
                bcrypt.compare(lastpassword, user.password).then((status) => {
                    if (status) {
                        response.status = true;
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })
            }
        })
    },
    findcoupon: (promo, userid) => {
        try {
            let today = new Date().toISOString().slice(0, 10)
            console.log(today);
            return new Promise(async (resolve, reject) => {
                let promooffer = await Coupon.findOne({ offer: promo })
                // console.log(promooffer);
                if(promooffer){
                    let alreadyused = await Usedcoupon.findOne({ coupon: Types.ObjectId(promooffer._id) }, { user: Types.ObjectId(userid) })
                    if (!alreadyused && promooffer.date >= today){
                        console.log('kiti');
                        resolve(promooffer)
                    }else{
                        resolve()
                    }
                }else{
                    console.log('promo illa');
                    resolve()
                }
            })
        } catch (error) {
            console.log(error);
        }

    },
    findusedcoupon: (promo, userId) => {
        try {
            return new Promise((resolve, reject) => {

            })
        } catch (error) {
            console.log(error);
        }
    },
    findWallBalance: (id) => {
        try {
            return new Promise((resolve, reject) => {
                User.findById(id).then((data) => {
                    resolve(data)
                })
            })
        } catch (error) {
            console.log(error);
        }
    }
}
