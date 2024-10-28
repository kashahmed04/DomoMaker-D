// gives us index.js from models which holds the domo.js file and we
// make a Domo variable to get the domo.js from the index.js in models**

// models are the database (schema information),
// controllers make the functions to work with the data from models,
// and views displays the data from controllers (router.js or just the handlebars files)**
// the index.js in controllers and models are used to export the other files
// in that folder**
// the schemas tell us how controllers can interact with the models
// and the controllers run on mongo and
// the views are handlabars and the library is under the hood
// bakn is the model and data is in the model
// and us as controller has the layer of phone to interact
// with the model and the model is the interface layer
// bank has our model interface level is our phone that lets us talk to the model
// models folder is not the model its the interface layer that talks to the model
// browser is client
// we make a request to see the domos and
// the node/express says we do not know anything about domos
// and it knows to go to interface
// layer or the domo model it contacts mongo and it says find
// all the domos absed on the account id and
// asynchronously monoo says here and give it to server and
// now the data about the persons domos
// are stored in the node/express tempoarily until we say res.render to
// go o handlebars and we render it with these specific domos with
// it and handlebars says here is the data we want for
// the views then node/express gets that and gives it back to the browser
// controller asks for data from model and views then sends back the final response to the browser
const models = require('../models');

// this shows up as green if I do not add the {} why and why does it
// not work if I use the {}**

// const {Domo} = models grabs the domo from model already
// and stores it
const { Domo } = models;

// The next thing to do is to make sure we can actually see the Domos each user
// makes. Change the makerPage function to grab all of the Domos for a particular user
// (based on their user session
// ID which we stored in their session in sign up and login in
// account.js in controllers)** and pass it to the view
// is there no id by default when we set up the session object in app.js**
const makerPage = async (req, res) => {
  try {
    // we need the {} when querying and when passing around json right**
    // (Ex. return res.json({ redirect: '/maker' });)**
    // go over**
    // do we use ownder since in domo.js in models
    // we reference account (what specificailly in account and is it
    // from models or controllers)**
    const query = { owner: req.session.account._id };
    // we want to get the name and age
    // for a domo and we separate it by a space
    const docs = await Domo.find(query).select('name age').lean().exec();

    return res.render('app', { domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error rerieving domos!' });
  }
};

// Next, we will make a makeDomo function and export it. This is very similar to our
// signup function in the Account controller. We need to create a new JSON object of
// our Domo data and pass it to the Domo Model
// (whenever we make a new instance of
// schema does it check for the requirements we
// put within the schma)** Once we have the database object,
// we just have to save it and handle any successes or errors.

// Notice for the Domo owner field, we put the ID of the owner we stored in req.session
// from the Account Model’s toAPI method. This is the nice part of storing a user’s data
// in their session. We can access the session
// anywhere we can access the request.**

// Notice that the success returns a JSON object
// with a redirect field. This field is not
// automatic by any means. This is nearly identical to our signup/login JSON. Our client
// fetch() function is waiting for a redirect variable to come back from the server to know
// what page to load. This is all setup and
// controlled by us. (go over process when does it go to router.js
// and where does request start at)**

// why is this async when do we know to make it async like we did for
// signup in account.js in controllers and the makerPage() above**
const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and are are required!' });
  }

  // how do we know to access the _id from the account in session is it because
  // each request has a session when we make the object in app.js or**
  // session is stored for each request right by default or from the account.js
  // model toAPI method**
  // there was nothing in req.session.account until we added the username and _id right**
  // in acount.js in controllers and models**
  // the req.session has the object we made in app.js**
  // schamas are all JSON objects right**
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    // we are keeping track of the owner based on the id
    // create date gets automatically added from the schema so we
    // do not need to add it when making our JSON objects right**
    // or is it because we had a default case for it if nothing was put in**
    // we could still make our own createDate right and it would work**
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    // how does it know /maker to go to since we have two of them
    // is it based on the functtion we are in****
    // since we use a .save() which uses promise.then() or async/await we
    // need to use this function
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

// We will do more with this in the next exercise. For now, we will
// just have it render out the main app page (can we render in any file
// to load the page how do we know which files we can render in (or do we only render in
// the controllers files))**
module.exports = {
  makerPage,
  makeDomo,
};
