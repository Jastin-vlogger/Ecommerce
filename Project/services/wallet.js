const { Types } = require('mongoose')
const User = require('../models/user')

module.exports = {
    refundForOnline:(amount,userId)=>{
        try {
            return new Promise((resolve,reject)=>{
                User.findByIdAndUpdate({_id:Types.ObjectId(userId)},{$set:{wallet:amount}}).then((data)=>{
                    resolve(data)
                })
            }) 
         } catch (error) {
             console.log(error);
         }
    }
}