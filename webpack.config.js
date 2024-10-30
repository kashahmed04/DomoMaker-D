
// Now that we have these tools installed, we need to configure webpack to work
// properly with babel. Go to webpack.config.js in the root folder of the project. Update it
// to include the following module entry.

// This entry tells webpack to use the babel-loader module to handle all js and jsx files
// being run through it (except any in the node_modules folder). Babel-loader will ensure
// our code gets run through the babel transpiler. 
// this is used so we can convert our react code into browser readable code with babel 
// use ES6 for the browser to render the code and display the data based on ES6**
// why did we need babel here and in the babel file (is it because this does the actual conversion
// into ES6 for the browser and the one in the babel file is used to say we are using react 
// with babel to convert into ES6)**
const path = require('path');

// Ideally, we want our client code to be broken up into two pieces:
// a “login bundle” which contains all the
// code needed to handle logging in and signing up, as well as an “app bundle” which
// contains all the code related to making domos.

// By defining multiple entry points, webpack will create multiple bundles. For the output
// filename, we use “[name]Bundle.js”. Webpack will pull in the name from the key in the
// entry object, so we will generate appBundle.js and loginBundle.js.
// do we use this to display the data or is it to link the JSX files to the 
// .handlebars page so we can use the specific elements in those files
// to display the data**
// we have two entry points right the app and the login**
module.exports = {
    entry: {
        app: './client/maker.jsx',
        login: './client/login.jsx'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};