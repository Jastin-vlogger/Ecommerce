const mongoose = require('mongoose')


const addressSchema = mongoose.Schema(
    {
        userId :{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        firstname:{
            type: String,
            required: true
        },
        lastname:{
            type: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        town:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
    },
  { timestamps: true }
)

const address = mongoose.model('address', addressSchema)

module.exports = address