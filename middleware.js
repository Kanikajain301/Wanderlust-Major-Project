module.exports.isLoggedIn = (req , res, next)=> {
    if(!req.isAuthenticated()){
        //redirect URL save
        req.session.redirecturl=req.originalUrl
       req.flash("error" , "You must be logged in first!");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirectUrl= req.session.redirecturl;
    }
    next();
};