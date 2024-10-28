// models only has access to index.js since we only called the folder right
// then from that folder we want to access account.js in
// the models folder so we do models.account to access it**
const models = require('../models');

const { Account } = models;

// we do this if we do not have any data to pass into varaibles in the HTML
// if we do have things to pass into the varaibles in the HTML, then we have a second
// parameter to fill in those varaibles**
const loginPage = (req, res) => res.render('login');

const signupPage = (req, res) => res.render('signup');

// this puts the user back at the default page which is the login page
// Add the following line to destroy the session. With the express-
// session module, every request will have a session object in it that manages the
// user’s session and session variables.
// The destroy function will remove a user’s session. We call this on logout so that our
// server knows they are no longer logged in
// (is this when save uninitailized comes in from app.js)**
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Similar to signup, we make sure we have all the data then we call the Model to
// handle the database entry for us. We are calling the Model’s static authenticate
// function. Again, to see how this works, just look at the function in the Account Model
// why don't we have to say AccountSchema.statics.authenticate like it is in account.js in models
// because we can just call account when we use statics then the name
// of the function**

// As mentioned previously, the req.session object also allows you to store data in the
// session about the user. You will not want to store a ton of data in the session object
// because it takes up memory and is not saved. You can use it to store a decent
// number of variables though (variables are data though)**

// This means once a user is logged in and has a session, you can store information
// about them that you don’t want to constantly look up in the database. Eventually this
// data will be backed up in redis, and will not be creating state on our server.**
// will we not do this in our project then and everything will be in redis instead
// of storing variables/data in the req.session object**
// why did we not use async here**
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // passes back everything in an account if it the passwords do match
  return Account.authenticate(username, pass, (err, account) => {
    // if there is an error (catch in account.js models) or
    // if there is no account because of the blank callback then we
    // go through this conditional**
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    // When a user logs in, we will attach all of the fields
    // from toAPI to their session for tracking (what is in account from authenticate is
    // it only the username or all the data for that user then here we make the id for the user for
    // the session according to their username here)**
    // do we attach a new id or is it already in the users data for the session**
    req.session.account = Account.toAPI(account);

    // how does it know which /maker to go to (the GET or the POST)****
    return res.json({ redirect: '/maker' });
  });
};

// This function will have a bit of complexity to it due to the encryption process. If you want to
// see how it works, look at the Account Model’s generateHash static function.**
// First, we validate the data. We cast to strings to guarantee valid types and then check
// if it is all there and the passwords match.**
// why do we need async here and we do not in the other functions**
const signup = async (req, res) => {
  // there is no schema to check for a valid datatype
  // so instead we make everything a string so we
  // can just make the new schema object out of it**
  // what if we wanted the password to be a number would we just cast it as a number
  // or how would we check its valid before making it an object in schema**
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    // this goes to the function to hash in the account.js in models
    // anytime we use statics in a models file we just have to pull
    // in that file and we can use that varible.name of the function()
    // to use that function in models (we usually do this in the controllers files to
    // work with the data)**
    // how did we know to use async/await here with generatehash()****
    const hash = await Account.generateHash(pass);
    // create a new user in the database (the account schema)** and save it in the database**
    // this is where to check occurs to make sure everything is a string based
    // on the schema but everything else was already set to a string above so we are good**
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();

    // Since the user is signing up and being logged in
    // automatically, we need to duplicate the account data in the session just like they had
    // logged in (2 _id's and usernames or two objects get created)****
    // do we also put a new id or an existing one from (are the two id's now for a user)**
    // this is for each request the username and session id will be attached right
    // and by default the session will be attached to each request for the specific user**
    // when we call req.session.account we can call ._id or .username
    // to access data with each request in controllers files only since it deals
    // with the data from model (we put data into the .account)**
    req.session.account = Account.toAPI(newAccount);

    // Provided the save works, we will send the user a redirect message that sends them
    // to the /maker page. Note that because of how sendPost() in client.js handles server
    // responses we can do this.**
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  signupPage,
  login,
  logout,
  signup,
};
