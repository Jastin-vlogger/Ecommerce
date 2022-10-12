const Admin = require('../services/admin')
const user = require('../services/user')

module.exports = {
    addcoupon: (req, res) => {
        try {
            let { Offername, discountRate, date } = req.body
            console.log(Offername, discountRate, date);
            Admin.addcoupon(Offername, discountRate, date).then((data) => {
                res.json(data)
            })
        } catch (error) {
            console.log(error);
            res.redirect('/error')
        }

    },
    checkcoupon: async (req, res) => {
        try {
            let { promo } = req.body
            let userId = req.userId
            // let couponused = await user.findusedcoupon(promo,userId)
            let coupon = await user.findcoupon(promo, userId)
            console.log(coupon);
            if (coupon) {
                res.json(coupon)
            } else {
                res.json({ status: false })
            }
        } catch (error) {
            console.log(error);
            res.redirect('/error')
        }

    },
    deletecoupon: (req, res) => {
        try {
            let { proid } = req.body
            Admin.canceloffer(proid).then((data) => {
                res.json(data)
            })
        } catch (error) {
            console.log(error);
            res.redirect('/error')
        }

    },
}