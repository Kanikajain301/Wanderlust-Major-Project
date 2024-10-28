if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
//console.log(process.env.SECRET);

const express = require("express");
const app= express();
const path= require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpresError= require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js"); 

const dburl= process.env.ATLAS_DB;

const store= MongoStore.create ({
   mongoUrl: dburl,
   secret:process.env.SECRET,
   touchAfter: 24 * 3600,
});
store.on("error",() => {
    console.log("Error in mongo session store", err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires: Date.now()+ 7 * 24 * 60 * 60 *1000 ,
    maxAge : 7 * 24 * 60 * 60 *1000 ,
    httpOnly: true,
  }
};

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded ({extended : true}));
app.use(methodOverride('_method'));
app.engine("ejs" , ejsMate);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
   res.locals.success = req.flash("success");
   next();
});
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});
app.use((req, res, next) => {
  res.locals.currUser= req.user;
  next();
});


const listingRouter = require("./routes/listings.js");
const reviewRouter=require("./routes/review.js"); 
const userRouter = require("./routes/users.js");

let port = 8080;

main().then(() =>{
    console.log("connection successful");
})
.catch(err => console.log(err));


async function main() {
  await mongoose.connect(dburl);
}
app.listen(port, () => {
  console.log(`app is listening to port ${port}`);
});



app.get("/", (req,res) => {
    res.send("root is working" );
});
app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/", userRouter);



app.use((err, req, res, next)=> {                           //MIDDLEWARE
  let {statuscode=500, message= "Something went wrong"}= err;
   res.status(statuscode).render("error.ejs" , {message});
   console.log(err);
});

