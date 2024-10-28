const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData = require("./data.js");


main().then(() =>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, Owner: "66c6f7b371b50a94480bd27e"})); //To add new Property in Schema.
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();

