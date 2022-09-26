const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    offer:{
        type:String,
        required:true,  
    },
    discount:{
        type:Number,
        default:0
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    date:{
        type:String,
        required:true,
    },
    expired:{
        type:Boolean,
        default:false,
    }
})

const coupon = mongoose.model('coupon',couponSchema)
module.exports = coupon