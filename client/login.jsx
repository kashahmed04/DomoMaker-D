
// The .jsx extension is
// useful for react files, as it will properly 
// enable the correct syntax highlighting for JSX
// the JSX files only get converted into ES6 with babel
// to display on the browser**

// First, we will require our
// helper code into this file (which we can do because of webpack)(webpack
// allows us to export and import on the client side right or what does this mean)**, 
// as well as the React and ReactDOM/client libraries. 
// We will grab the functions we need out of them.

// Then we will make a function for handling the submit event on the login form. Note
// that when we call sendPost we don’t pass in a handler function as the third parameter.
// The build in error handling we wrote inside of sendPost will be sufficient for this
// scenario.

const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

//how does this know to do this if we press the submit button (is it onSubmit in the
//JSX part below)** (is onSubmit used for inputs for type submit)** why can't we put
//a button click event then same for the handleSignup**
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    //go over what we pass in and if we call handleError above
    //why do we need the check in sendPost then**
    helper.sendPost(e.target.action, {username, pass});
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!username || !pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
}

//do we capitalize JSX files like this**
//why do we not have a closing input here because we are allowed to have
//a closing input**

// Now that we have these event handlers, we can create our React components that will
// use them. Since this is a simple component that will not update when the user types
// into it, we will make a “functional stateless component” or FSC. Add the following to
// login.jsx. Note that we have proper syntax highlighting for the JSX since this is a .jsx
// file.**
// go over all**
// what is the difference between this and an HTML file or a .handlebars
// file and why do we put it here**
// why do we still need the action is it because we still use it in the server
// and in router.js to go to specific methods and where does this get passed
// in is it here or in helper.js where the action and method get passed in
// to go to the server**
const LoginWindow = (props) => {
    return(
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >

            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" type="submit" value="Sign in" />

        </form>
    );
};

const SignupWindow = (props) => {
    return(
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >

            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />

        </form>
    );
};

// Now we need to add event listeners to the buttons on the page so that the react
// components get rendered when they are clicked (basically
// we will go to the function according to if the button is clicked to do
// and action like we have been doing)**
// We will do this in an init function that
// gets called when the window loads. We will also tell it to render the LoginWindow
// immediately so that there is something on the page when the user first loads it. You’ll
// note that we are using the new React 18 “createRoot” syntax here to make a React
// Root to render things.
const init = () => {
    //there is no login button, signup button, or content in our HTML
    //above though**
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    //go over create root**
    const root = createRoot(document.getElementById('content'));

    //the root.render basically goes to the HTML above to load
    //the page based on the button clicked right**
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) =>{
        e.preventDefault();
        root.render( <SignupWindow />);
        return false;
    });

    //this makes the login window show up first when we load the 
    //application (how does this know to show up first
    //since we also have the maker.JSX file and that 
    //shows pages)**
    root.render( <LoginWindow />);
};

window.onload = init;
