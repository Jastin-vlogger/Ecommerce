const Order = require('../models/order')


module.exports = {
    findorders:async(req,res)=>{
        let orders = await Order.find()
        res.render('admin/orderMangement',{orders});
    }
}