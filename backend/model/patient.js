const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

let patient = new Schema({
    name:{
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    contact: {
      type: Number
    }
    
  });

  const patient_model = mongoose.model("patients", patient);

  module.exports = patient_model;
  