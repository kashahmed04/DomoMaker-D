// Remove the signupPage controller function and its module export. We no longer
// need this page because our new login page will work both for logins and signups.

const models = require('../models');

const { Account } = models;
//why do we need this still if we call the login page in login.JSX how does this work now
//does it go to the .handlebars first or the login.JSX file first then the .handlebars file**
const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

//why do we not use async/await here or promises since we are working with the data
//or is it only with editing/deleting/adding new data where we have use async/await or promises
//and just reading data does not need it**
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    req.session.account = Account.toAPI(account);
    //how does it know which /maker to go to since we have the GET and POST request for /maker**
    //how does this work now since we have the JSX files**
    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
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
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    //what did it mean we had to duplicate this data for signup
    //does this mean there are two usernames and _id's for the user**
    req.session.account = Account.toAPI(newAccount);

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
  login,
  logout,
  signup,
};
