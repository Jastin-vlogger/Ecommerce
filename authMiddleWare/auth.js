const jwt = require('jsonwebtoken')

module.exports={
    verify:(req,res,next)=>{
    const token = req.cookies.token
    if (token) {
        try {
            //the imp thing 
            const user = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
                console.log(user+'hellllllllllllllll');
                if(err){
                    res.status(401).json('token not valid');
                }
                req.userId = user.userdata._id;
                req.userName = user.userdata.firstName;
                next();
            });
            console.log(user);
            }catch (error) {
            res.clearCookie('token');
            return  res.redirect('/login');
        }
    }else{
        next()
    }
        
},
userLoggedIn:(req,res,next)=>{
    const token = req.cookies.token
    console.log(token);
        try {
            console.log("try");
            //the imp thing 
            const user = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            req.userId = user.userdata._id;
            req.userName = user.userdata.firstName;
            next(); 
            } catch (error) {
            console.log("error"); 
            res.clearCookie('token');
            next()
        }
}
}

