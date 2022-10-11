const Order = require('../models/order')
const Banner = require('../models/banner')
const adminHelpers = require('./category')
const productController = require('./productController')
const Category = require('../models/category')
const Coupon = require('../models/coupon')
const { Types } = require('mongoose')
const { response } = require('../app')
const Admin = require('../models/admin')
const Product = require('../models/product')
const User = require('../models/user')



module.exports = {
    findOrders: () => {
        return new Promise(async (resolve, reject) => {
            let data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().getMonth() - 10)
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.item',
                        foreignField: '_id',
                        as: 'pro'
                    }
                },
                {
                    $unwind: '$pro'
                },
                {
                    $project: {
                        cat: '$pro.category',
                        total: '$pro.discountedPrice'
                    }
                },
                {
                    $group: {
                        _id: '$cat',
                        count: { $sum: 1 },
                        total: { $sum: "$total" },
                        detail: { $first: "$$ROOT" }
                    }
                },
                {
                    $sort: { detail: -1 }
                }
            ])
            console.log(data);
            resolve(data)
        })
    },
    totalUser: () => {
        return new Promise((resolve, reject) => {
            User.find({}).countDocuments().then((data) => {
                resolve(data)
            })
        })
    },
    findorderbyweek: () => {
        return new Promise(async (resolve, reject) => {
            let data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date() - 1000 * 60 * 60 * 24 * 7 * 4)
                        }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        dayOfWeek: { $dayOfWeek: "$createdAt" },
                        week: { $week: "$createdAt" },
                        total: '$totalAmount',
                    }
                },
                {
                    $group: {
                        _id: '$week',
                        count: { $sum: 1 },
                        total: { $sum: '$total' },
                        detail: { $first: '$$ROOT' }
                    }
                },
                {
                    $sort: { detail: 1 }
                }
            ])
            resolve(data)
        })
    },
    findorderbymonth: () => {
        return new Promise(async (resolve, reject) => {
            let data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().getMonth() - 10)
                        }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        dayOfWeek: { $dayOfWeek: "$createdAt" },
                        week: { $week: "$createdAt" },
                        total: '$totalAmount'
                    }
                },
                {
                    $group: {
                        _id: '$month',
                        count: { $sum: 1 },
                        total: { $sum: '$total' },
                        detail: { $first: '$$ROOT' }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ])
            resolve(data)
        })
    },
    findorderbycat: () => {
        return new Promise(async (resolve, reject) => {
            let data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().getMonth() - 10)
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.item',
                        foreignField: '_id',
                        as: 'pro'
                    }
                },
                {
                    $unwind: '$pro'
                },
                {
                    $project: {
                        cat: '$pro.category'
                    }
                },
                {
                    $group: {
                        _id: '$cat',
                        count: { $sum: 1 },
                        detail: { $first: "$$ROOT" }
                    }
                },
                {
                    $sort: { detail: -1 }
                }
            ])
            // console.log(data);
            resolve(data)
        })
    },
    findOrdersbyday: () => {
        return new Promise(async (resolve, reject) => {
            let data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date() - 1000 * 60 * 60 * 24 * 7)
                        }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        dayOfWeek: { $dayOfWeek: "$createdAt" },
                        week: { $week: "$createdAt" },
                        total: '$totalAmount'
                    }
                },
                {
                    $group: {
                        _id: '$dayOfWeek',
                        count: { $sum: 1 },
                        total: { $sum: '$total' },
                        detail: { $first: '$$ROOT' }
                    }
                },
                {
                    $sort: { detail: 1 }
                }
            ])
            resolve(data)
        })
    },
    bannermange: async (req, res) => {
        let data = await Banner.find()
        let categories = await productController.findCategory()
        console.log(data);
        res.render('admin/addBanner', { data, categories, title: 'Banner Mangement' });
    },
    addbanner: async (req, res) => {
        try {
            console.log(req.body);
            let { heading, desc, category } = req.body
            let categor = await Category.findOne({ name: category })
            // console.log(categor._id);
            let image = req.files.image
            let addbanner = {
                header: heading,
                description: desc,
                category: categor._id,
            }
            let data = await adminHelpers.addbannertodb(addbanner)
            console.log(data);
            image.mv(`public/bannerImg/${data}.jpg`)
            res.redirect('/admin/bannermangement');
        } catch (error) {
            console.log(error);
            res.redirect('/error')
        }

    },
    
    addoffer: async (req, res) => {
        let offers = await Coupon.find()
        console.log(offers);
        res.render('admin/add_offer', { offers, title: 'Add Offers' });
    },
    addcoupon: (Offername, discountRate, date) => {
        let offer = {
            offer: Offername,
            discount: discountRate,
            date: date
        }
        return new Promise(async (resolve, reject) => {
            await new Coupon(offer).save().then((data) => {
                resolve(data)
            })
        })
    },
    canceloffer: (id) => {
        return new Promise(async (resolve, reject) => {
            await Coupon.findByIdAndUpdate({ _id: Types.ObjectId(id) }, { $set: { expired: true } }).then((response) => {
                resolve(response)
            })

        })
    },
    detailview: (req, res) => {
        try {
            console.log('njan ivida');
            let id = req.params.id
            console.log(id);
            productController.finddetailoforder(id).then((data) => {
                console.log(data);
                res.json(data)
            })
        } catch (error) {
            console.log(error);
        }

    },
    findAdmin: (email) => {
        try {
            return new Promise((resolve, reject) => {
                Admin.findOne({ email: email }).then((data) => {
                    resolve(data)
                })
            })
        } catch (error) {
            console.log(error);
        }
    },
    findproductdesc: (id) => {
        return new Promise((resolve, reject) => {
            Product.findById({ _id: Types.ObjectId(id) }).select('description').then((data) => {
                resolve(data)

            })
        })
    },
    todaytotal: () => {
        return new Promise(async (resolve, reject) => {
            let data = Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date() - 1000 * 60 * 60 * 24)
                        }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" },

                    }
                },
            ])
            resolve(data)
        })
    },
    monthtotal: () => {
        return new Promise((resolve, reject) => {
            Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date() - 1000 * 60 * 60 * 24 * 7 * 4)
                        }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmount' }
                    }
                }
            ]).then((res) => {
                // console.log(res);
                resolve(res)
            })
        })
    },
    yeartotal: () => {
        return new Promise(async (resolve, reject) => {
            let data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date() - 1000 * 60 * 60 * 24 * 7 * 4 * 12)
                        }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $group: {
                        _id: 1,
                        total: { $sum: '$totalAmount' },

                    }
                }
            ])
            resolve(data)
        })
    }

}