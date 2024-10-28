const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");



module.exports.createReview = async(req, res)=> {
    console.log(req.params.id);
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review (req.body.review);
 
   listing.reviews.push(newReview);
 
   await newReview.save();
   await listing.save();

   req.flash("success", "New Review created");
   res.redirect(`/listings/${listing._id}`);
 };


module.exports.destroyReview = async(req, res)=> {
    let {id , reviewId } = req.params ;
    let trimmed_id = reviewId.trim()
    let trimm_id = id.trim();
 
    await Listing.findByIdAndUpdate(trimm_id , {$pull: {reviews: trimmed_id}});
    await Review.findByIdAndDelete(trimmed_id);
   
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${trimm_id}`);
 };