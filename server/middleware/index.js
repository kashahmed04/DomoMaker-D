// Next we will setup Middleware. Middleware in Express is a powerful system for
// injecting code calls in between other calls. Often you see it used in routing and error
// handling. Most all of our express plugins could be considered middleware.

// For example, our Express-session module is middleware. On every request, it is
// injecting checks for cookies, getting variables from Redis and creating a variable in
// the request called req.session.

// Now we will add some useful redirection for requests. For example, if a user is not
// logged in (i.e., does not have a session), then why even let them go to the app page
// and show an error?

// Middleware functions receive a request, response, and the next middleware function
// to call. This allows your application to make various decisions and potentially chain
// into the next middleware call. The request will not continue through the system
// UNLESS you call the next function at the end.
// we always need to call next() at the end in middleware files****

// For middleware functions to continue to the controllers, you MUST call the next
// function. However, you may not want your request to get the controllers if the request
// is not valid. You may want to redirect them to a different page or stop the request
// entirely.

// Add a requiresLogin function that checks if we attached an account to their session
// and redirects to the homepage if not.

// Similarly, add a requiresLogout function that checks if the user is already logged in
// (we attached an account to their session) and redirects them to the app if so.
// go over****
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }

  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }

  return next();
};

// If the user is trying to do something secure, such as logging in, then we will check to
// see if they are on HTTPS and redirect them if not.

// *Note: Normally you check for security by checking if req.secure is true, but the
// Heroku environment is all encrypted internally so it would always be true. Instead, we
// will check to see if the forwarded request (through Heroku) was secure by checking
// the request’s “x-forwarded-proto” header.

// For local development/testing, we can’t easily run HTTPS, so instead we will just
// bypass the check.

// go over****
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    // if we are not in https and we type http instead we
    // make the url change back to https with the hostname and
    // the url we are on****
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

// How do we know if we are on Heroku or not? Environment variables! This is where
// the power of custom environment variables comes in. We will be creating an
// environment variable called NODE_ENV that we will set to “production” on Heroku.
// Then when the server starts, we can just check which to export based on the
// environment.

// If later on your code isn’t working on Heroku but works locally, chances are it has to
// do with you either not setting up your NODE_ENV config var correctly, or something
// being messed up in the requiresSecure function.

// Any of these environment variables can be accessed by name in code with
// process.env.VAR_NAME
// go over****
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// on heroku we check for secuirty
// with our .NODE_ENV variable****
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
  // for security if we run it locally
} else {
  module.exports.requiresSecure = bypassSecure;
}
