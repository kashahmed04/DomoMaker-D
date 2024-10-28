const controllers = require('./controllers');
const mid = require('./middleware');

// could we have done Domo = controllers.Domo; and Account = controllers.Account
// do we need the {} when defining variables or no because otherwise the variable
// is not blue and it's green instead**

// We need to connect each request with the series of relevant middleware.

// The way router level middleware in Express works is you connect as many
// middleware calls as you want in the order you want the middleware to run. The first
// parameter is always the URL. The last parameter is always the controller. Everything
// in between is any of the middleware operations you want to call.

//  For GETs to / or /login we want to make sure it’s secure, so we call
// requiresSecure. Then we also want to make sure they are logged out (so they
// don’t see a login page if they are logged in), so we call requiresLogout.

//  For POSTs to /login or /signup we want to make sure it’s secure, so we call
// requiresSecure. We also want to make sure they are logged out (so they can’t try
// to login when logged in), so we call requiresLogout.

//  For GETs to /logout we want to make sure they are logged in, so we call
// requiresLogin. They can’t logout if they aren’t logged in.

//  For GETs to /maker we want to make sure they are logged in. They can’t get to
// their app page if they aren’t logged in.

//  For POSTs to /maker we want to make sure they are logged in. They can’t try to
// add characters to their account if they aren’t logged in.
// These middleware calls are all functions we made in the middleware file.

// go over all (these middleware functions run before the main functions in
// controller right so these all run for each request)****

// Well, the middleware fires in order on each URL and if it passes
// the middleware criteria then it calls the next middleware function. If it does not pass
// the middleware criteria then the flow is broken and a different page is rendered
// instead of their request. This is what our middleware index file does.

// read across and each runs one at a time and .next() lets us go to the next function from
// left to right
const router = (app) => {
  // these two GET and POST requests are responsible for getting the login or signup page for
  // the user and posting what they put in to allow them to login or signup
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // gives the user the logout page
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // when we do /maker on the signup page it checks this
  // middleware function and since the account does not exist yet
  // we go to / then we check that function and since the user does not
  // exist yet we go to the next function to the right which is the login page****
  // this the page to the user to be able to create the character
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);

  // It will call the Domo Controller’s make function
  app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

  // default case
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // are we not making a /* for GET or POST
  // in project 2, we set up a 404 page instead for a default case (by using handlebars to make the
  // page then have he default case)
  // we are not using any HEAD requests right even though GET handles HEAD requests
};

module.exports = router;
