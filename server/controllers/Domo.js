const models = require('../models');

const { Domo } = models;

// In the next step we will write code to retrieve the list of domos
// for our client React code to render instead.
// so react allows us to move things from the server to the client
// so we can get information faster and display the information faster and
// do not have to keep calling the server to get things for us**
// does it also not refresh the page for a rerender of new domos since we are on the same
// page (is that how react works if we are on the same page or)**

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
const makerPage = (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age level').lean().exec();

    // no rendering here because**
    // how does this work without rendering**
    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'Name, age, and level are required!' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    // You will notice that when you add a domo, the entire page flickers before the new
    // domo shows up in the list. This is because the page is reloading every time we create
    // a domo, since that is what the makeDomo controller function tells it to do. We don’t
    // want this happening, as it defeats the purpose of using React.

    // Go to /server/controllers/Domo.js, and modify the makeDomo function. Rather than
    // send a redirect command to the client on successful creation of a domo, we want to
    // simply tell them it was a success by sending a 201 “Created” status code.

    // so basically we just return a success status instead of reloading the page when
    // a new domo is made because App() in maker.JSX already
    // handles rereendering and shows the new data without reloading the page unlike it did here
    // once a domo is created**
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

// is this ok**
// go over how each connection works from router.js, controllers.js,
// helper.js, and maker.JSX**
const deleteDomo = async (req, res) => {
  // can we also define things within the try catch**
  try {
  // make sure we delete based on the user that is logged in (do we need this)**
    const userId = req.session.account._id;
    // get the domo id from the URL (pathname from router)**
    const { id } = req.params;

    // Find the Domo by ID and ensure it belongs to the current user
    const domo = await Domo.findOne({ _id: id, owner: userId });

    if (!domo) {
      return res.status(404).json({ message: 'Domo not found' });
    }

    await Domo.findByIdAndDelete(id);

    // 200 means successful deletion right**
    return res.status(200).json({ message: 'Domo deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting Domo' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
