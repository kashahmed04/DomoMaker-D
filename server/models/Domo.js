// so models sets up the schema up for the information in the database and
// controllers works with that data and displays it with render
// and the views are the pages to display and we display them based on
// router.js or handlebars or both**
// and the index.js for both controllers and models are used to export the other files
// from those folders to be used**
// go over all**
const mongoose = require('mongoose');
// what does this do**
const _ = require('underscore');

// injection attack is common and they say what is the name of their domo
// and escape says if there are any characters that would be used for a request
// it ensures it makes sure it evaluates as code and trim removes
// the whitespace after****
const setName = (name) => _.escape(name).trim();

// go over**
// this makes sure the data is the right type and length right for schemas
// the data coming in and out of the server**
// is this only when we create a new instance of the schema or how does this
// all relate to controllers files**
const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // does this mean this function runs for each name****
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    // use the _id based on the user
    type: mongoose.Schema.ObjectId,
    required: true,
    // we have to know which domo is owned by each person so we
    // use account
    ref: 'Account',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

// this is a different toAPI than the account.js one**
// we do not use this yet will we use it eventually****
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

// this allows us to make a Domo schema object in controllers right
// and we have to call it Domo right and what else (go over)**
// tells the database we want data to be represented this way as a model (name of the data
// is Domo and we use the schema to create new Domo objects)**** with the schema
// and we talk to the database this way by exporting the model interface****
const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
