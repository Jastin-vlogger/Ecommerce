const { Types, default: mongoose } = require('mongoose')
const { response } = require('../app')
const product = require('../data/product')
const { db } = require('../models/product')
const Product = require('../models/product')
const Cart = require('../models/userCart')
const Order = require('../models/order')
const Address = require('../models/address')
const Category = require('../models/category')
const Wishlist = require('../models/userwhislist')

module.exports = {
    addProduct: (product) => {
        console.log(product);
        let {name,description,price,stock,category} =product
        let pro = {
            name:name,
            description:description,
            price:price,
            stock:stock,
            category:category
        }
        return new Promise(async (resolve, reject) => {
            await new Product(pro).save().then((data) => {
                resolve(data._id)
            })
        })      
    },
    addDiscountedProduct: (id, value) => {
        return new Promise(async (resolve, reject) => {
            await Product.findOneAndUpdate({ _id: Types.ObjectId(id) }, { $set: { discountedPrice: value } })
        })
    },
    findProduct: (search, page) => {
        const limit = 2
        return new Promise(async (resolve, reject) => {
            let data = await Product.find({
                $or: [
                    { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { category: { $regex: '.*' + search + '.*', $options: 'i' } },
                ]
            })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            let count = await Product.find({
                $or: [
                    { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { category: { $regex: '.*' + search + '.*', $options: 'i' } },
                ]
            })
                .countDocuments();

            let cont = Math.ceil(count / limit)

            resolve(data, cont)
        })
    },
    findCategory: () => {
        return new Promise(async (resolve, reject) => {
            await Category.find().then((response) => {
                resolve(response)
            })
        })
    },
    deleteProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            let softdelete = await Product.findByIdAndUpdate({ _id: Types.ObjectId(id) }, { $set: { isDeleted: true } })
            resolve(softdelete)
        })
    },
    updateProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            await Product.findById(id).then((data) => {
                resolve(data)
            })
        })
    },
    updatedProduct: (updatedData, id) => {
        const { name, description, category, price } = updatedData;
        return new Promise(async (resolve, reject) => {
            let data = await Product.findByIdAndUpdate({ _id: Types.ObjectId(id) }, {
                $set: {
                    name: name,
                    description: description,
                    category: category,
                    price: price,
                }
            })
            resolve(data._id)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            // await Product.find().then((data)=>{
            //     resolve(data)
            // })
            Product.aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: 'name',
                        as: 'categories'
                    }
                },
                {
                    $project: {
                        name: '$name',
                        category: '$category',
                        offer: '$categories.offer',
                        price: '$price',
                        isDeleted: '$isDeleted'
                    }
                }
            ]).limit(4).then((data) => {
                resolve(data)
            })
        })
    },
    finde:()=>{
        return new Promise((resolve,reject)=>{
            Product.find({}).select('price').then((res)=>{
                resolve(res)
            })
        })
    },
    productDetails: (id) => {
        return new Promise(async (resolve, reject) => {
            await Product.aggregate([
                {
                    $match: { _id: Types.ObjectId(id) }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: 'name',
                        as: 'product'
                    }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        name: '$name',
                        category: '$product.name',
                        offer: '$product.offer',
                        price: '$price',
                        stock:'$stock'
                    }
                }
            ]).then((data) => {
                resolve(data)
            })
        })
    },
    addToCart: (productId, userId) => {
        let productadd = {
            item: Types.ObjectId(productId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {

            let userCart = await Cart.findOne({ user: Types.ObjectId(userId) })

            if (userCart) {
                const alreadyExists = userCart.products.findIndex(product => product.item == productId)
                if (alreadyExists === -1) {
                    const adding = await Cart.updateOne(
                        {
                            user: Types.ObjectId(userId)
                        }, {
                        $push: { products: { item: Types.ObjectId(productId), quantity: 1 } }
                    }).then((response) => {
                        resolve(response)
                    })
                } else {
                    await Cart.updateOne({ 'user': Types.ObjectId(userId), 'products.item': Types.ObjectId(productId) },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }
                    ).then((response) => {
                        resolve(response)
                    })
                }
            } else {
                let newCart = {
                    user: userId,
                    products: [productadd]
                }
                await Cart(newCart).save().then((response) => {
                    resolve(response)
                })
            }
        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartitems = await Cart.aggregate([{
                $match: { user: mongoose.Types.ObjectId(userId) }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    product: { $arrayElemAt: ['$product', 0] }
                }
            },
            ]).then((cart) => {
                resolve(cart)
            })
        })
    },
    deleteCart: (productId, userId) => {
        return new Promise(async (resolve, reject) => {
            let orderlist = await Cart.updateOne({ user: Types.ObjectId(userId), "products.item": Types.ObjectId(productId) }, { $pull: { products: { item: Types.ObjectId(productId) } } })
            console.log(orderlist);
            resolve(orderlist)
        })
    },
    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await Cart.findOne({ user: Types.ObjectId(userId) })
            if (cart) {
                resolve(cart.products)
            } else {
                resolve('your cart is empty')
            }

        })
    },
    getOrderProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderitems = await Order.aggregate([
                {
                $match: { _id: mongoose.Types.ObjectId(orderId)}
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind:'$product'
            },
            {
                $project: {
                    town:'$deliveryDetails.address',
                    state:'$deliveryDetails.state',
                    pincode:'$deliveryDetails.pincode',
                    paymentMethod:'$paymentMethod',
                    purchase :'$totalAmount',
                    date:'$date',
                    original:'$product.price',
                    name:'$product.name',
                    category:'$product.category',
                    image:'$product._id',
                    offer:'$couponOffer',
                    offername:'$coupon'
                }
            },

            ]).then((orderitems) => {
                console.log(orderitems);
                resolve(orderitems)
            })


        })
    },
    getorderId: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orderId = await Order.findById({ user: (userId) })
            console.log(orderId);
            resolve(orderId)
        })
    },
    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await Order.find({ userId: mongoose.Types.ObjectId(userId) }).sort({ _id: -1 })
            resolve(orders)
        })
    },
    cancelOrder: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderC = await Order.findByIdAndUpdate({ _id: Types.ObjectId(orderId) }, { $set: { ordercanceled: true } })
            resolve(orderC)
        })
    },
    cancelOrderadmin: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderC = await Order.findByIdAndUpdate({ _id: Types.ObjectId(orderId) }, { $set: { ordercanceled: true } })
            resolve(orderC)
        })
    },
    changeOrderStatus: (orderId, status) => {
        return new Promise(async (resolve, reject) => {
            let orderstatuschanged = await Order.findByIdAndUpdate({ _id: Types.ObjectId(orderId) }, { $set: { status: status } })
            resolve(orderstatuschanged)
        })
    },
    addAddress: (firstname, lastname, address, town, state, pincode, userId) => {
        let saveaddress = {
            userId: Types.ObjectId(userId),
            firstname: firstname,
            lastname: lastname,
            address: address,
            town: town,
            state: state,
            pincode: pincode,
        }
        return new Promise(async (resolve, reject) => {
            let addedAddress = await Address(saveaddress).save();
            resolve(addedAddress)
        })
    },
    removeAddress: (addressId) => {
        return new Promise(async (resolve, reject) => {
            let removeAddress = await Address.findByIdAndRemove(addressId)
            console.log(removeAddress);
            resolve(removeAddress)
        })

    },
    categorizeProduct: (catname) => {
        return new Promise(async (resolve, reject) => {
            let data = await Product.find({ category: catname })
            //   console.log(data);
            resolve(data)
        })
    },
    addTowhishlist: (productId, userId) => {
        let productadd = {
            item: Types.ObjectId(productId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {

            let userWish = await Wishlist.findOne({ user: Types.ObjectId(userId) })

            if (userWish) {
                const alreadyExists = userWish.products.findIndex(product => product.item == productId)
                if (alreadyExists === -1) {
                    const adding = await Wishlist.updateOne(
                        {
                            user: Types.ObjectId(userId)
                        }, {
                        $push: { products: { item: Types.ObjectId(productId), quantity: 1 } }
                    }).then((response) => {
                        resolve(response)
                    })
                } else {
                    await Wishlist.updateOne({ user: Types.ObjectId(userId), 'products.item': Types.ObjectId(productId) },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }
                    ).then((response) => {
                        resolve(response)
                    })
                }
            } else {
                let newWish = {
                    user: userId,
                    products: [productadd]
                }
                await Wishlist(newWish).save().then((response) => {
                    resolve(response)
                })
            }
        })
    },
    getwishlistProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wish = await Wishlist.aggregate([
                {
                    $match: { user: mongoose.Types.ObjectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },

            ]).then((wish) => {
                console.log(wish);
                resolve(wish)
            })
        })
    },
    deleteWishProduct: (productId, userId) => {
        return new Promise(async (resolve, reject) => {
            let list = await Wishlist.updateOne({ user: Types.ObjectId(userId), "products.item": Types.ObjectId(productId) }, { $pull: { products: { item: Types.ObjectId(productId) } } })
            console.log(list);
            resolve(list)
        })
    },
    finddetailoforder: (id) => {
        try {
            return new Promise(async (resolve, reject) => {
                let order = await Order.aggregate([
                    {
                        $match: { _id: Types.ObjectId(id) }
                    },
                    {
                        $lookup:{
                            from:'products',
                            localField:'products.item',
                            foreignField:'_id',
                            as:'orderdetail'
                        }
                    },
                    {
                        $lookup:{
                            from:'users',
                            localField:'userId',
                            foreignField:'_id',
                            as:'userdetail'
                        }
                    },
                    {
                        $unwind:'$orderdetail'
                    },
                    {
                        $unwind:'$userdetail'
                    },
                    {
                        $project:{
                            id:'$orderdetail._id',
                            name:'$orderdetail.name',      
                            totalAmount:'$orderdetail.price',
                            ordercanceled:'$orders.ordercanceled',
                            state:'$deliveryDetails.state',
                            address:'$deliveryDetails.state',
                            pincode:'$deliveryDetails.pincode',
                            status:'$status',
                            discount:'$orderdetail.discountedPrice',
                            payment:'$paymentMethod',
                            category:'$orderdetail.category',
                            image:'$orderdetail._id',
                            email:'$userdetail.email',
                            nameuser:'$userdetail.firstName'
                        }
                    }
                ])
                // console.log(order);
                resolve(order)
            })
        } catch (error) {
            console.log(error);
        }
    },
    changestockquantity:(proId,minusstock)=>{
        try {
           return new Promise((resolve,reject)=>{
            Product.findByIdAndUpdate({_id:Types.ObjectId(proId)},{$inc:{stock:-minusstock}}).then((res)=>{
                resolve(res)
            }).catch((error)=>{
                reject(error)
            })
           }) 
        } catch (error) {
            console.log(error);
        }
    }
}

