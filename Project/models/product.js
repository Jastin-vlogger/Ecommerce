const mongoose = require('mongoose')


const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isDeleted:{
      type:Boolean,
      default:false,
    },
    discountedPrice:{
      type:Number,
    }
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product