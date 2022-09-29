const Category = require('../models/category')
const Banner = require('../models/banner')
const { Types } = require('mongoose')
const Product = require('../models/product')

module.exports={
    addCategory:(name,offer)=>{
        let product = {
            name:name,
            offer:offer,
        }
        return new Promise (async(resolve,reject)=>{
            await new Category(product).save().then((data)=>{
                resolve(data)
        })   
        })
    },
    editcoupon:(offer,id)=>{
        return new Promise (async(resolve,reject)=>{
            await Category.findByIdAndUpdate({_id:Types.ObjectId(id)},{$set:{offer:offer}}).then((data)=>{
                resolve(data)
            })
        })
    },
    findcategory:()=>{
        return new Promise (async(resolve,reject)=>{
            Product.aggregate([
                {
                    $lookup:{
                        from:'categories',
                        localField:'category',
                        foreignField:'name',
                        as:'categories'
                    }
                },
                {
                    $project:{
                        name:'$name',
                        category:'$category',
                        offer:'$categories.offer',
                        price:'$price',
                        isDeleted:'$isDeleted'
                    }
                }
            ]).then((data)=>{
                resolve(data)
            })
        })
    },
    findcategoryAdmin:()=>{
        return new Promise ((resolve,reject)=>{
             Category.find().then((data)=>{
                resolve(data)
            })
        })
    },
    findCategory:(id)=>{
        return new Promise (async(resolve, reject)=>{
            await Category.findById(id).then((data)=>{
                resolve(data)
            })
        })
    },
    recheckCat:(data)=>{
        return new Promise (async(resolve,reject)=>{
            await Category.findOne({name:data}).then((data)=>{
                resolve(data)
            })
        })
    },
    updatedCategory:(name,catId)=>{
        return new Promise (async(resolve,reject)=>{
            await Category.findByIdAndUpdate({_id:catId},{name:name}).then((data)=>{
                resolve(data._id)
            })
        })
    },
    deletecategory:(id)=>{
        return new Promise (async(resolve,reject)=>{
            await Category.findByIdAndRemove(id).then((data)=>{
                resolve(data)
            })
        })
    },
    addbannertodb:(data)=>{
        return new Promise (async(resolve,reject)=>{
            await Banner(data).save().then((data)=>{
                resolve(data._id)
            })
        })
    }
}