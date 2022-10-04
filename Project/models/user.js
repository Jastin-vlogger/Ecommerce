const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,  
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true,  
    },
    lastName:{
        type:String,
        required:true
    },
    isAdmin:{
        type: Boolean,
        default:false,
    },
    blocked:{
        type: Boolean,
        default:false,
    },
    number:{
        type: Number,
        required:true,
    },
    wallet:{
        type:Number,
        default:0
    },
    referal:{
        type:String,
    },
    referral_code:{
        type:String,
    },
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema)
module.exports = User