const Coupon = require('../models/coupon')
const Admin = require('../controllers/admin')
const user = require('../controllers/user-helpers')
const usedcoupon = require('../models/usedcoupon')
const { Types } = require('mongoose')

module.exports ={
    addcoupon:(req,res)=>{
       let {Offername,discountRate,date}= req.body
       console.log(Offername,discountRate,date);
       Admin.addcoupon(Offername,discountRate,date).then((data)=>{
        res.json(data)
       })
    },
    checkcoupon:async(req,res)=>{
        let {promo} =req.body
        let userId = req.userId
        // let couponused = await user.findusedcoupon(promo,userId)
        let coupon = await user.findcoupon(promo,userId)
        if(coupon == undefined){
            res.json({status:false})
        }else{
            res.json(coupon)
        }
    },
    deletecoupon:(req,res)=>{
        let {proid} = req.body
        Admin.canceloffer(proid).then((data)=>{
            res.json(data)
        })
    },
    findCoupon:(couponusing)=>{
        try {
            return new Promise((resolve,reject)=>{
            Coupon.findOne({discount:couponusing}).then((data)=>{
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
    }
}