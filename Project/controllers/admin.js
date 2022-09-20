const Order = require('../models/order')


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
    }
}