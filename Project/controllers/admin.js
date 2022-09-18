const Order = require('../models/order')


module.exports ={
    findOrders:()=>{
        return new Promise (async(resolve,reject)=>{
            let count = await Order
            resolve(count)
        })
    }
}