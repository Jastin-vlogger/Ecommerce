const Coupon = require('../models/coupon')
const user = require('./user')
const usedcoupon = require('../models/usedcoupon')
const { Types } = require('mongoose')

module.exports ={
    findCoupon:(couponid)=>{
        try {
            return new Promise((resolve,reject)=>{
            Coupon.findById({_id:Types.ObjectId(couponid)}).then((data)=>{
            resolve(data)
            })
        }) 
        } catch (error) {
           console.log(error);
        }
          
    },
    usedcoupon:(id,userId)=>{
        try {
            return new Promise (async(resolve,reject)=>{
                let usecoupon = {
                    coupon:id,
                    user:Types.ObjectId(userId),
                }
                let coupon = await usedcoupon.findOne({coupon:Types.ObjectId(id)})
                console.log(coupon);
                if(coupon){
                    usedcoupon.updateOne({coupon:Types.ObjectId(id)},{$push:{user:Types.ObjectId(userId)}}).then((data)=>{
                        console.log('im already');
                        resolve(data)
                    })
                }else{
                    usedcoupon(usecoupon).save().then((response)=>{
                        console.log('im new');
                        resolve(response)
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },
}