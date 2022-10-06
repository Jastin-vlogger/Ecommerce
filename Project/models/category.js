const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,  
    },
    productid:{
        type:String,
        // required:true,
    },
    offer:{
        type:Number,
        default:0
        // required:true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
})

const category = mongoose.model('category',categorySchema)
module.exports = category