const mongoose = require('mongoose')



const whislistSchema = mongoose.Schema(
  {
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'users',
      required: true,
    },
    products:Array
  }
)

const  whislist = mongoose.model('Whishlist', whislistSchema)

module.exports = whislist