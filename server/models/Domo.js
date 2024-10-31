const mongoose = require('mongoose');

// go over**
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // trim says that if we have extra spaces cut them out
    // but if there is one space in between words that is ok
    // (cuts the space in the beginning and end right)**
    trim: true,
    // this function will always run based on the name**
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  level: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    // the type allows us to have the _id for the user based
    // on account.js in controllers and models, but the ref: does**
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

// we never used this**
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
});

//what we want to data to be called then how each object is created
//then we export the entire DomoModel to be able to create
//DomoSchema objects and work with them**
const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
