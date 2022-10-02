const Admin = require('../models/admin')
const AdminController = require('../services/admin')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async (req, res) => {
        try {
            let credential = await AdminController.findAdmin(req.body.email)
            if (credential) {    
            if (credential.email === req.body.email && credential.password === req.body.password) {
                let { email } = req.body
                //the important part
                const token = jwt.sign({ email }, process.env.ADMIN_TOKEN_SECRET, { expiresIn: "2d" })
                res.cookie('adminToken', token, {
                    httpOnly: true,
                })
                res.redirect('/admin/dashboard')
            } else if (credential.password != req.body.password) {
                res.render('admin/login', {
                    nameError: '',
                    passErr: 'Password incorrect',
                    nameVal: req.body.email,
                })
            }
        }else{
            res.render('admin/login', {
                nameError: 'Email not found',
                passErr: '',
                nameVal: req.body.email,
            })
        }
        } catch (error) {
            console.log(error);
        }
    },
    productDes:async(req,res)=>{
        try {
           let id = req.params.id
            let pro = await AdminController.findproductdesc(id)
            res.json(pro)
        } catch (error) {
            throw new Error(error)
        }
    }
}