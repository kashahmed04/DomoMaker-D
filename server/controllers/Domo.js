const models = require('../models');

const { Domo } = models;

// In the next step we will write code to retrieve the list of domos
// for our client React code to render instead.
// so react allows us to move things from the server to the client
// so we can get information faster and display the information faster and
// do not have to keep calling the server to get things for us**
// does it also not refresh the page for a rerender of new domos since we are on the same
// page (is that how react works if we are on the same page) or**

// Now we will make a getDomos function to retrieve all of the domos belonging to the
// logged in user.

// This function will allow us to just get JSON responses of Domos for a user. This will
// allow our client app to update dynamically using React. We can pair the data on
// screen to the data from this function.**

// Once we do that, our app will update without changing pages. We’ll be able to
// dynamically grab updates from the server and immediately update the UI on screen.
// This is a major improvement over our previous system that required the page to
// reload.
// what does dynamically mean**
const makerPage = async (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age').lean().exec();

    // no rendering here because**
    // how does this work without rendering**
    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and are are required!' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
