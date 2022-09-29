const Order = require('../models/order')


module.exports = {
    findorders: async (req, res) => {
        let search = '';
        if (req.query.search) {
            search = req.query.search
        }
        // let perPage = 9
        let page = req.params.page || 1
        if (req.query.page) {
            page = req.query.page
        }
        const limit = 10
        // let orders = await Order.find({
        //     $or: [
        //         { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        //         { category: { $regex: '.*' + search + '.*', $options: 'i' } },
        //     ]
        // })
        //     .skip((page - 1) * limit)
        //     .limit(limit * 1)
        //     .sort({ _id: -1 })
        //     .exec()
        let orders = await Order.aggregate([
            // {
            //     $project:{
            //         item:'products.item'
            //     }
            // },
            {
                $lookup: {
                    from: 'products',
                    foreignField: '_id',
                    localField: 'products.item',
                    as:'orders'
                }
            },
            {
                $unwind:'$orders'
            },
            {
                $project:{
                    id:'$orders._id',
                    name:'$orders.name',      
                    totalAmount:'$totalAmount',
                    ordercanceled:'$ordercanceled',
                    state:'$deliveryDetails.state',
                    status:'$status',
                    paymentMethod:'$paymentMethod',
                }
            },

        ]).skip((page - 1) * limit)
        .limit(limit * 1)
        .sort({ _id: -1 })
        .exec()
        // console.log(orders);

        let count = await Order.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { category: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        }).countDocuments()
        // let order = await Order.find().sort({ _id: -1 })
        res.render('admin/orderMangement', { orders, pages: Math.ceil(count / limit), current: page });
    },
    findIsOrderOnline:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let order = await Order.findById(id)
            resolve(order)
        })
    }
}