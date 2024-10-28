/* This file defines our schema and model interface for the account data.

   We first import bcrypt and mongoose into the file. bcrypt is an industry
   standard tool for encrypting passwords. Mongoose is our tool for
   interacting with our mongo database.
*/
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

/* When generating a password hash, bcrypt (and most other password hash
   functions) use a "salt". The salt is simply extra data that gets hashed
   along with the password. The addition of the salt makes it more difficult
   for people to decrypt the passwords stored in our database. saltRounds
   essentially defines the number of times we will hash the password and salt.
*/
const saltRounds = 10;

let AccountModel = {};

/* Our schema defines the data we will store. A username (string of alphanumeric
   characters), a password (actually the hashed version of the password created
   by bcrypt), and the created date.
*/
// Remember that a Schema is a definition or blueprint
// of what data looks like. This is what allows us to know our
// data is formatted correctly going into the database and what
// the variable names/types will be coming out of the database

// is it when we compress the data coming into the server
// and out of the server back to the client (or when we create
// a new schema object)**

// go over**
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    // The match field ensures users Regex to
    // ensure that the username is alphanumeric and 1-16 characters.**
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.

// Notice that the schema also has a few functions attached as
// AccountSchema.statics. Anything attached to a
// schema in .statics is going to be
// a function you can call through the Model (with a variable referncing it from controllers
// like we did in account.js in controllers)**
// like how we access toAPI, generateHash, and authenticate in account.js in controllers**
// static function are built into the model itself and it
// gets moveed around with the model so we can use it as
// the name of the variable we have for this file in account.js in controller then
// use the function
AccountSchema.statics.toAPI = (doc) => ({
  // why do we need to put username here if we never use it****
  username: doc.username,
  // where does id come from**
  _id: doc._id,
});

// Helper function to hash a password
// hash the password based on the saltRounds (10 times) to secure our password
// in the database (how many times should we usually hash)**
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

/* Helper function for authenticating a password against one already in the
   database. Essentially when a user logs in, we need to verify that the password
   they entered matches the one in the database. Since the database stores hashed
   passwords, we need to get the hash they have stored. We then pass the given password
   and hashed password to bcrypt's compare function. The compare function hashes the
   given password the same number of times as the stored password and compares the result.
*/

// For example, the authenticate function in the Account.js Model is a static function
// defined by the Schema. This means that you can call authenticate by calling
// Account.authenticate from any file that pulls the account model in. Since it has been
// attached to the Model through the Schema, the function has access to the database
// but not a particular object
// (so does this mean we have to get the object
// first then use these functions for those specific objects like
// making a schema object based on the request values then using these functions like
// we did in account.js in controllers or is it based on the request)**
// go over**
// why do we return a callback**
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    // username does not exist**
    if (!doc) {
      return callback();
    }

    // if the password passed in the password we are finding based on
    // the username match then**
    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    // passwords do not match**
    return callback();
  } catch (err) {
    // error**
    return callback(err);
  }
};

// go over**
// this allows us to make a new schema by using Account (new Account instead
// of new AccountSchema and what else)****
AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
