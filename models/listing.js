const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const Review = require("../models/reviews.js");


const listingSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    
    description: {
        type: String,
        required : true,
    },

    image: {
        filename:{
        type: String,
        },
        url: {
         type: String,
        }
    },

    price: {
        type: Number,
    },

    location: {
        type: String,
    },

    country: {
        type: String,
    },

    reviews: [
        {
         type: Schema.Types.ObjectId,
         ref: "reviews",
    },
],
    Owner: {
        type: Schema.Types.ObjectId,
         ref: "User",
         //required : true,
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        }
      }
});

   listingSchema.post("findOneAndDelete" ,async (listing) => {            //MIDDLEWARE TO DELETE ALL THE REVIEWS WHEN A LISTING IS DELETED
    if(listing){
    
    await Review.deleteMany( {_id: { $in : listing.reviews} });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
