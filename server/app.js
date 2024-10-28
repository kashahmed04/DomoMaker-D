// what does it mean by In place of YOUR_REDIS_CLOUD_URL, put your connection string from Redis
// Cloud with the username and password filled
// out becase only the password is filled out in .env****
// go over redis setup****
// are the domos going to be different on the same account based on if we are in local host
// or in heroku****
// First, we need to add sessions so that we can accurately track who logged in and
// who they are. In a stateless transaction, every transaction is new, so we need a ticket
// to identify this person. We use sessions to handle that for us.

// A session is a uniquely generated key that is tracked by the server to map to an
// individual user. The unique key is then sent to the user as a cookie that the server
// can track. In each request, the cookies are sent back to the server, in which it will
// then see if it has a session id that matches that unique cookie.**
// is the session data and session id there by default with cookies and did we
// add the id and username to it or is there an id already (or is it the session object
// we make below so each user will have this data when they login or signup and it will
// be used for each of the users request (the same object or))**

// cookies are basically used for sessions and to log a user out if they are
// logged in for too long with or without activity**

// cookie is a key value that the client has and a session is server side rather than
// forcing the user to send their username and password with every request
// so we store who they are to make it easier for them so they do not have to login
// for each request
// we send the username and password and we say it is tracked that we have logged in
// and we have a session_id server side so we can do the request and the session
// id is sent back each request so we know which user is changing the data
// session is persisted in the server in memeory but in domo maker C it will be persisted in
// redis and the session is an object req.session.account is what we set in account.js
// and we can put anything in there that we want to keep track of the user
// toAPI takes the account and stores the data and that gets put into the session
// and when someone connects we can look at their req.session.account._id and it allows
// us to ties their data to the session id

// Cookies are just key:value pairs set by the server or browser for tracking purposes.

// As such, you want to make sure you secure your cookies and refresh them over time.
// This usually means automatically logging users out or just sending them a new
// session id back sometimes. This limits how long a key is available, and how much
// time in which it could potentially be stolen. There are added protections against this
// that we will also add later.

// The dotenv library is a simple tool for working with .env files. Simply put, it will parse
// any key-value pairs in the .env file and import them into the process.env object. This
// is the same thing that config vars on Heroku do. We can also add more config
// variables here if we want. The format is that each line is a different variable, and they
// are in the KEY=VALUE format (go over)****
require('dotenv').config();

const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
// the cookies are made in redis and that stores the account and
// the session username and _id from the toAPI function

// what is helmet (go over where it is defined as well)**
// Some of the libraries used above are not ones we have seen before. Here are some
// brief descriptions.
// Helmet: a security library for express. Sets a bunch of default options for us to
// obscure information from malicious attacks (what kind of attacks)**
// library that adds a bunch of security that is not there by default
const helmet = require('helmet');

const session = require('express-session');

// We will use the connect-redis package. The connect-redis package is designed for
// storing session data & cookies in Redis. If you need Redis for other reasons, you
// could just get the redis package alone. We will also need the base Redis library.
// go over****
const RedisStore = require('connect-redis').default;
const redis = require('redis');

// ../ means go up a folder but ./ means in the same folder right
// and / means go to the root directory right (yes)
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Use “mongodb://127.0.0.1/DomoMaker” and the process.env.MONGODB_URI
// variable for the database connection. Node will first attempt to connect to your
// MongoDB Cloud instance (first option)**, and will fallback to your
// local Mongo instance (second option)(the link we set up from monngoDB compass right)**
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';

mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Now that your REDISCLOUD_URL has been loaded into
// process.env.REDISCLOUD_URL (where does this occur in app.js or
// the .env file)****, we can use it to create our redis client. Because
// Heroku will populate this same environment variable, our code will work in both
// locations (redis and heroku)****.
// We will use it to instantiate the redis client, and add an error handler to it.
// Do this just below where you connected mongoose to your mongo database.****
const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Keep your server running, but in code change the node port from 3000 to 3001. Then
// open a second Powershell (or Terminal) window and start a second node server.

// In the same browser you logged in on, open a tab and go to 127.0.0.1:3001/maker
// why does it work when I do local host but not this version****

// It should take you directly to the app. Since the sessions are stored in Redis and both
// servers (port 3000 and port 3001) are using Redis, they both have access to the
// same variables (the session id still exists in redis and we are still logged
// in so we can access the app page for the same account on different tabs (even if we refresh
// the terminal we do not get logged out on both tabs even though port 3000 is not
// in the code anymore))****

// You can store all sorts of shared variables in Redis that all of your servers can
// access. This helps with dev (being able to restart node constantly without losing data)
// and with production (having server redundancy).****

// why doesnt the other server (3000) shut down if we change the port to 3001****

// Now that we have the client setup, we need to tell it to connect to our Redis instance.
// To do this we will call redisClient.connect(). This process is contacting the database,
// and the rest of our code needs to wait until we have connected. Since node does not
// support top-level await in CommonJS, we will need to use a promise to delay the rest
// of our code (not async/await becuase it runs in the background and does not stop our
// other code from running unlike promise.then()
// which does stop our code until it's done loading)****
// why do we put all of this in the redisClient.connect()****
redisClient.connect().then(() => {
  const app = express();

  app.use(helmet());
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

  // In your app.js, add a section for session configuration. To do this, tell your express
  // app to use express-session. The express-session module takes several configuration
  // options as a JSON object (as shown below)
  // Once it is configured, the session module will add a
  // session object to every request object which can be accessed by saying
  // “req.session”. This session object can be used to track and store information unique
  // to that user between requests.** (is the id given or do we make that in
  // account.js in models and controllers for login and signup and access that by doing
  // req.session.account._id or username)**
  app.use(session({
    // name of our cookie so it can be tracked in requests
    // when the browser sends requests the cookies will come as well
    // the key tells our session module which cookie to look for when
    // looking for a session cookie (we can have multiple sessions set up for)**
    // for security purposes we should use a key name
    // sessionid is the name of the id for the cookie
    // the req.session.account._id is the id from mongoDB and it's
    // from mongo
    key: 'sessionid',

    // Now we can set up our
    // session system in express and tell it to use this client. Below, inside of the .then()
    // handler, update the session setup to look like the code below. This will tell the
    // express-session library to utilize our redis database to store the sessionid for each
    // user instead of storing it in memory like we have been now we are making it
    // stateless and we can close our server and reopen it and we will still be logged in
    // because our session id (_id we made in account.js in models) will still exist
    // when we refresh the page after reopening the server
    // whereas before when we closed the server then opened it again, the session _id
    // would not exist and we would be logged out and when we reloaded the page****

    // In the previous assignment, when you restarted the server and went to a page it
    // broke because the sessions were no longer there. This is because the sessions were
    // stored in server variables. This means when the server restarts and memory is
    // cleared, the data is no longer there.
    // With Redis, our sessions are stored outside of the server. This means during dev you
    // can restart the server as many times as you want without losing variable data.****
    // do we still need everything here like using session and all these values in here
    // even if we are using redis to store session data only**** now and not the server to store
    // session data only****
    store: new RedisStore({
      client: redisClient,
    }),
    // private string used as a seed for hashing/creating unique session keys
    // this makes it so our unique session keys are different
    // from other servers using express
    // The secret can be changed to anything you want, but will invalidate
    // existing session ids (which isn’t necessarily a huge issue)
    // when we move to redis all of the sessions will be in redis even if
    // the server starts and stops (login and it gets persisted in redis and change
    // the secret then it will log us out and the session will not be persisted)
    // secret is test and if someone logs into the server and if we generate a random
    // sessionid or url and if we give them the id of 123 and we take 123
    // and we also add into it test and it gets hashed and this is now the id we send back to the
    // user and now in redis we saw the sessionid is the hashed code and when we stop the server it
    // all goes away and we change the secret to test and we restart the server and we say
    // the sessionid is 123 then we say 123 then add hello to it and it gets hashed again
    // and this is the sessionid with the server and if we see the id for the user based on
    // test it will not esxist since we changed the thing to hello and it says
    // we have not logged in correctly because of the sessionid (we have to login
    // with each new session)
    // to invalidate every sessionid we change the secret for security breaches etc.
    // since we do not use redis for now, then if we stop the server the sessions will
    // be deleted so we do not have to worry about it
    secret: 'Domo Arigato',
    // set to false tells the session library to only send the session key
    // back to the databse if it changes
    // if it were true then we would generate a lot of databse
    // requests that are unecessary (when do we set it to true)**
    // we don't normally persist sessions in servers so right now it's stateful
    // and depending on
    // inside the middlware if resave is set to true everytime the user makes a request
    // even if we do not modify we resave it in the databse and if we keep track of a lifetime
    // foreach it will be good but if we do not do resave and we do not
    // save for each
    // even if the session did not change it will save it even though the
    // session did not chance but false makes it get saved when the session is changed
    resave: false,
    // The saveUninitialized option set to false prevents us
    // from saving uninitialized sessionids to the database (if the user does not have
    // and id and this is just if there is an id and we have not done anything yet)
    // saveuninitialized says if we made the id and we have not used the id,
    // do not save it into the database and keep it locally and we do this because
    // if we are generating an id for every person that connects even if they are not logged
    // in it's a waste of space and if they have not logged in then do not
    // keep a session for them, otherwise keep the session
    saveUninitialized: false,
  }));

  app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
  app.use(compression());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/../views`);

  router(app);

  app.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening on port ${port}`);
  });
});
