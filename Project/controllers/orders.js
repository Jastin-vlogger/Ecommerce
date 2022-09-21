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
        let orders = await Order.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { category: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        })
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .sort({ _id: -1 })
            .exec()
            

        let count = await Order.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { category: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        }).countDocuments()
        // let order = await Order.find().sort({ _id: -1 })
        res.render('admin/orderMangement', { orders , pages : Math.ceil(count / limit),current: page});
    }
}