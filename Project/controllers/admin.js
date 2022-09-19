const Order = require('../models/order')


module.exports ={
    findOrders:()=>{
        return new Promise (async(resolve,reject)=>{
            let data = await Order.aggregate([
                {
                    $match:{ createdAt:{
                            $gte: new Date(new Date() - 7*60*60*24*1000)
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
                        count:{$sum:1}
                    }
                },
                // {
                //     $sort:{
                //         _id:-1
                //     }
                // }
        ])
            console.log(data);
            resolve(data)
        })
    }
}