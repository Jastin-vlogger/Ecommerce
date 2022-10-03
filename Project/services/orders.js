const Order = require('../models/order')
const Admin = require('./admin')

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
        let orders = await Order.aggregate([
            {
                $lookup: {
                    from: 'products',
                    foreignField: '_id',
                    localField: 'products.item',
                    as: 'orders'
                }
            },
            {
                $unwind: '$orders'
            },
            {
                $project: {
                    id: '$orders._id',
                    name: '$orders.name',
                    totalAmount: '$totalAmount',
                    ordercanceled: '$ordercanceled',
                    state: '$deliveryDetails.state',
                    status: '$status',
                    paymentMethod: '$paymentMethod',
                }
            },

        ]).skip((page - 1) * limit)
            .limit(limit * 1)
            .sort({ _id: -1 })
            .exec()

        let count = await Order.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { category: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        }).countDocuments()
        let ordersbycategory = await Admin.findorderbycat()
        let week = await Admin.findorderbyweek()
        let catwise = await Admin.findOrders()
        let month = await Admin.findorderbymonth()
        // console.log(week);
        let moo = []
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (const val of month) {
            let month = `${val.detail.month}`
            let m = months[month]
            moo.push(m)
        }
        month.forEach((val,i)=>{
            val.detail.month = moo[i]
        })
        // console.log(month);
        res.render('admin/orderMangement', { orders, pages: Math.ceil(count / limit), current: page, catwise, week, month ,title:'Order Management'});
    },
    findIsOrderOnline: (id) => {
        return new Promise(async (resolve, reject) => {
            let order = await Order.findById(id)
            resolve(order)
        })
    }
}