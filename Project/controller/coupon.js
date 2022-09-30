const Admin = require('../services/admin')
const user = require('../services/user')

module.exports = {
    addcoupon: (req, res) => {
        let { Offername, discountRate, date } = req.body
        console.log(Offername, discountRate, date);
        Admin.addcoupon(Offername, discountRate, date).then((data) => {
            res.json(data)
        })
    },
    checkcoupon: async (req, res) => {
        let { promo } = req.body
        let userId = req.userId
        // let couponused = await user.findusedcoupon(promo,userId)
        let coupon = await user.findcoupon(promo, userId)
        console.log(coupon);
        if (coupon == undefined) {
            res.json({ status: false })
        } else {
            res.json(coupon)
        }
    },
    deletecoupon: (req, res) => {
        let { proid } = req.body
        Admin.canceloffer(proid).then((data) => {
            res.json(data)
        })
    },
}