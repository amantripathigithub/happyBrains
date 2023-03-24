const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let post = new Schema({
    email: {
      type: String
    },
    ptype:{
        type: String
    },
    name: {
      type: String 
    },
    problem : {
        type: String 
      },
     
    
    solved :{
      type: Number
    },
    
    solutions:[{
     
        type:String
      
    }]
  });

  const post_model = mongoose.model("posts", post);

  module.exports = post_model;
  