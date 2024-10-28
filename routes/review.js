const express = require("express");
const router= express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpresError= require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

const reviewController = require("../controllers/reviews.js");

const validateReview =(req, res, next) => {           //MIDDLEWARE function
    let result= reviewSchema.validate(req.body);
    console.log(result);
    if(result.err){
      throw new ExpresError(400 , result.err);
    } 
    next();
  };


  //REVIEW POST ROUTE
router.post("/" , validateReview, wrapAsync(reviewController.createReview));
  
  //REVIEW DELETE ROUTE 
router.delete("/:reviewId" , wrapAsync(reviewController.destroyReview));

  module.exports = router;