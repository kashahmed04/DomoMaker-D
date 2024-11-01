// check if github is ok and files**
// are delete functinonality and adding a level for domos ok
// and not reloading the page for those**
// check if heroku keys are ok**
// how do I fix the CSS to have the textboxes show up after each label**
// can make name numbers now even though we are not supposed to**
// is it ok for client side to show entering a number instead of a letter for age
// and level**
// I get an error if I press the delete buttons to fast is that ok (double taps sometimes
// for the same domo)**
// should we put createdDate for all of our schemas on project(yes)
// should we have 404 page for all our errors on project
// or different pages for different errors (send back JSON for other errors but render a 404 page)
// whenever we need to contact database we have to use promise.then()
// or async or await because it returns a promise
// (like adding/deleting/reading data/changing state)

// React makes use of a special syntax known as JSX. JSX is not supported by any
// modern browser, and so we need to use babel to convert it to actual ES6 that the
// browser can use.
// We will also want to install React and ReactDOM into the project to get access to the
// features of the react library. These libraries will be bundled with our client side code
// using webpack.

// Remove the signup.handlebars view. We will no longer need this in our new
// implementation.

// The reason we no longer need this file is that we are moving to a structure with
// dynamic views (what are dynamic views)**
// We will be using React.js to create the appropriate view for us. The
// login and signup will be on the same page, and will dynamically show up when
// necessary (go over is this like show and hide with HTML elements)**

// does react basically mix the JS and HTML for the client side
// and take some back end server code and move it to the client side
// (front end) or what does it do**

require('dotenv').config();

const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');

const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';

mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// why do we put this all in redisClient (go over redis implementation)**
redisClient.connect().then(() => {
  const app = express();

  app.use(helmet());
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

  app.use(session({
    key: 'sessionid',

    store: new RedisStore({
      client: redisClient,
    }),
    secret: 'Domo Arigato',
    resave: false,
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
