const Order = require('../models/order')
const Banner = require('../models/banner')
const adminHelpers = require('../controllers/category')
const productController = require('../controllers/productController')
const Category = require('../models/category')
const Coupon = require('../models/coupon')
const { Types } = require('mongoose')
const { response } = require('../app')



module.exports ={
    findOrders:()=>{
        return new Promise (async(resolve,reject)=>{
            let data = await Order.aggregate([
                {
                    $match:{ createdAt:{
                            $gte: new Date(new Date() - 60*60*24*1000*7)
                        }
                    }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        dayOfWeek: { $dayOfWeek: "$createdAt" },
                    }
                },
                {
                    $group:{
                        _id:'$dayOfWeek',
                        count:{$sum:1},
                        detail:{$first:'$$ROOT'}
                    }
                },
                {
                    $sort:{detail:1}
                }
        ])
            // console.log(data);
            resolve(data)
        })
    },
    findorderbyweek:()=>{
        return new Promise(async(resolve,reject)=>{
            let data = await Order.aggregate([
                {
                    $match:{
                        createdAt:{
                            $gte:new Date(new Date() - 1000*60*60*24*7*7)
                        }
                    }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        dayOfWeek: { $dayOfWeek: "$createdAt" },
                        week: { $week: "$createdAt" }
                    }
                },
                {
                    $group:{
                        _id:'$week',
                        count:{$sum:1},
                        detail:{$first:'$$ROOT'}
                    }
                },
                {
                    $sort:{detail:1}
                }
            ])
            resolve(data)
        })
    },
    findorderbymonth:()=>{
        return new Promise (async(resolve,reject)=>{
            let data = await Order.aggregate([
                {
                    $match:{
                        createdAt:{
                            $gte:new Date(new Date().getMonth() - 10)
                        }
                    }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        dayOfWeek: { $dayOfWeek: "$createdAt" },
                        week: { $week: "$createdAt" }
                    }
                },
                {
                    $group:{
                        _id:'$month',
                        count:{$sum:1},
                        detail:{$first:'$$ROOT'}
                    }
                },
                {
                    $sort:{detail:-1}
                }
            ])
            resolve(data)
        })
    },
    bannermange:async(req,res)=>{
        let data = await Banner.find()
        let categories = await productController.findCategory()
        console.log(data);
        res.render('admin/addBanner',{data,categories});
    },
    addbanner:async(req,res)=>{
        console.log(req.body);
        let { heading,desc,category} = req.body
        let categor = await Category.findOne({name:category})
        console.log(categor._id);
        let image = req.files.image
        let addbanner = {
            header:heading,
            description:desc,
            category:categor._id,
        }
        let data =  await adminHelpers.addbannertodb(addbanner)
        console.log(data);
        image.mv(`public/bannerImg/${data}.jpg`)
         res.redirect('/admin/bannermangement');
    },
    addoffer:async(req,res)=>{
        let offers = await Coupon.find()
        console.log(offers);
        res.render('admin/add_offer',{offers});
    },
    addcoupon:(Offername,discountRate,date)=>{
        let offer = {
            offer : Offername,
            discount :discountRate,
            date:date
        }
        return new Promise (async(resolve,reject)=>{
            await new Coupon(offer).save().then((data)=>{
                resolve(data)
            })
        })
    },
    canceloffer:(id)=>{
        return new Promise(async(resolve,reject)=>{
            await Coupon.findByIdAndUpdate({_id:Types.ObjectId(id)},{$set:{expired:true}}).then((response)=>{
                resolve(response)
            })

        })
    }
}