const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let contributor = new Schema({
    email: {
      type: String
    },
    password: {
      type: String
    },
    name: {
      type: String 
    },
   
    contact: {
        type: Number
    },
    rating:{
      type: Number
    },
    category:{
      type: String
    }
  });

  const contributor_model = mongoose.model("contributors", contributor);

  module.exports = contributor_model;
  