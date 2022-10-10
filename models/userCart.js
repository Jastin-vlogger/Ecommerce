const mongoose = require('mongoose')



const cartSchema = mongoose.Schema(
  {
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'users',
      required: true,
    },
    products:Array
  }
)

const  userCart = mongoose.model('Cart', cartSchema)

module.exports = userCart