const Order = require('../models/order')


module.exports = {
    findorders:async(req,res)=>{
        let orders = await Order.find().sort({_id:-1})
        res.render('admin/orderMangement',{orders});
    }
}