const mongoose = require('mongoose')

const usedcouponSchema = new mongoose.Schema({
    coupon:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,  
    },
    user: Array
})

const usedcoupon = mongoose.model('usedcoupon',usedcouponSchema)
module.exports = usedcoupon