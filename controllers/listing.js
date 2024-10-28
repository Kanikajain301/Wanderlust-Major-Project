const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingclient = mbxGeocoding({ accessToken: maptoken });


module.exports.index= async(req, res)=> {
    const alllisting= await Listing.find({});
    res.render("home.ejs", { alllisting });
  };



module.exports.renderNewForm =  (req, res)=> {
    res.render("new.ejs");
  };



module.exports.showListing= async(req, res)=> {
    let {id}= req.params;
    const item= await Listing.findById(id).populate("reviews").populate("Owner");
    
    if(!item){
     req.flash("error", "Listing you are searching does not exist");
     res.redirect("/listings");
    }
    console.log(item);
    res.render("show.ejs", { item });
 };


//CREATE LISTING
module.exports.createListing= async(req, res, next)=> {
 let response= await geocodingclient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();

    try{
      let url = req.file.path;
      let filename= req.file.filename;
    const newlisting= new Listing(req.body.listing);
    newlisting.image={url, filename};
    newlisting.geometry = response.body.features[0].geometry;
   await newlisting.save();
   req.flash("success", "New listing created");
   res.redirect("/listings");
    }
    catch(err){
      next(err);
    }
  };




module.exports.renderEditForm = async(req, res)=> {
    let { id } = req.params; 
    const listid = await Listing.findById(id);
    if(!listid){
      req.flash("error", "Listing you are trying to edit does not exist");
      res.redirect("/listings");
     }

     let originalImageUrl = listid.image.url;
     originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("edit.ejs", {listid , originalImageUrl});
  };



module.exports.editListing =async(req, res)=> {
    let {id}= req.params;
   let edited = await Listing.findByIdAndUpdate(id , {...req.body.listing});
  
   if(typeof req.file !== "undefined"){
   let url = req.file.path;
   let filename= req.file.filename;
   edited[image]={url, filename};
   await edited.save();
   }
   
   req.flash("success", "listing Updated");
   res.redirect("/listings");
  };


  
module.exports.destroyListing= async(req, res)=> {
    let { id }= req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success", "listing Deleted");
   res.redirect("/listings");
  };