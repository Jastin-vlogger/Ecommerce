const Coupon = require('../models/coupon')
const Admin = require('../controllers/admin')
const user = require('../controllers/user-helpers')

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
        // console.log(promo)
        let coupon = await user.findcoupon(promo)
        // console.log(coupon);
        if(coupon == undefined){
            res.json({status:false})
        }else{
            res.json(coupon)
        }
    }
}