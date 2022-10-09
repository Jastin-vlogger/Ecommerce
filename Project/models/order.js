const mongoose = require('mongoose')


const orderSchema = mongoose.Schema(
    {
        deliveryDetails:{
            type: Object,
            required: true
        },
        userId :{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        paymentMethod:{
            type: String,
            required: true
        },
        products:{
            type:Array,
            required:true
        },
        totalAmount:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            required:true,
        },
        date:{
            type:String,
            required:true,
        },
        ordercanceled:{
            type:Boolean,
            default:false,
        },
        coupon:{
            type:String,
        },
        couponOffer:{
            type:Number,
        }
    },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order