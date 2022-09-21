const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    header:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true
    },
    image:[{type:String}],
    category:{
        type: mongoose.Schema.Types.ObjectId
    }
})

const banner = mongoose.model('Banner',bannerSchema)
module.exports = banner