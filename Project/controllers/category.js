const Category = require('../models/category')
const Banner = require('../models/banner')

module.exports={
    addCategory:(product)=>{
        return new Promise (async(resolve,reject)=>{
            await new Category({...product}).save().then((data)=>{
                resolve(data)
        })   
        })
    },
    findcategory:(findcategory)=>{
        return new Promise (async(resolve, reject)=>{
            await Category.find().then((data)=>{
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
    updatedCategory:(updatedData)=>{
        return new Promise (async(resolve,reject)=>{
            await Category.updateOne(updatedData).then((data)=>{
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