const jwt = require('jsonwebtoken')

module.exports={
    adminverify:(req,res,next)=>{
    const token = req.cookies.adminToken
    console.log(token);
    if (token) {
        try {
            //the imp thing 
            const admin = jwt.verify(token,process.env.ADMIN_TOKEN_SECRET);
            req.admin = admin;
            next();
            } catch (error) {
            res.clearCookie('adminToken');
            return res.redirect('/admin/login')
        }
    } else {
        res.redirect("/admin/login")
    }  
},
adminLoggedIn:(req,res,next)=>{
    const token = req.cookies.adminToken
    console.log(token);
        try {
            //the imp thing 
            const admin = jwt.verify(token,process.env.ADMIN_TOKEN_SECRET);
            req.admin = admin;
            return res.redirect('/admin/dashboard')
            console.log(admin);
            } catch (error) {
            res.clearCookie('adminToken');
            next();
        }
}
}