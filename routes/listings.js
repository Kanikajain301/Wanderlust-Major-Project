const express = require("express");
const router= express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpresError= require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");

const validateListing =(req, res, next) => {           //MIDDLEWARE function
    let result= listingSchema.validate(req.body);
    console.log(result);
    if(result.err){
      throw new ExpresError(400 , result.err);
    } 
    next();
  }



//INDEX ROUTE
router.get("/",  wrapAsync(listingController.index));
  
  //NEW ROUTE
  router.get("/new",isLoggedIn,  listingController.renderNewForm);
  
  
  //SHOW ROUTE
  router.get("/:id", wrapAsync(listingController.showListing));
  
  
  //CREATE ROUTE
 router.post("/", isLoggedIn ,upload.single('listing[image]'), validateListing,  wrapAsync(listingController.createListing) );
 

  //EDIT ROUTE
  router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));
  
  
  //UPDATE ROUTE
  router.patch("/:id", isLoggedIn, upload.single('listing[image]') ,wrapAsync(listingController.editListing));
  
  //DESTROY ROUTE
  router.delete ("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));


  module.exports = router;