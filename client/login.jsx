
// The .JSX extension is
// useful for react files, as it will properly 
// enable the correct syntax highlighting for JSX
// the JSX files only get converted into ES6 with babel
// to display on the browser**

// Try signing up without a password. It should give you errors like before our react
// changes (step 26) is this saying errors should remain the same as before**
// for going from the login page or signup page to maker there should be a page change right 
// but not from login to signup or signup to login right**

// First, we will require our
// helper code into this file (which we can do because of webpack)(webpack
// allows us to export and import on the client side right or what does this mean)**, 
// as well as the React and ReactDOM/client libraries. 
// We will grab the functions we need out of them.

// Then we will make a function for handling the submit event on the login form. Note
// that when we call sendPost we don’t pass in a handler function as the third parameter.
// The built in error handling we wrote inside of sendPost will be sufficient for this
// scenario.

const helper = require('./helper.js');
const React = require('react');
//what does this do**
const {createRoot} = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    //go over what we pass in and why we call handleError above
    //if it gets called in sendPost()**
    //why do we need the check in sendPost then**
    //what is e.target.action an e.target.value**
    //the data (second parameter) gets turned into a JSON
    //object so the server can work with the the data
    //then we get that back from the server in the result
    //and work with it in sendPost to redirect the user
    //or return an error**
    helper.sendPost(e.target.action, {username, pass});
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    //why do we use e.target.querySelector here instead of document is it because
    //we created these elements in the functional component of react (is this how we usually
    //reference elements made in the functional or class component of react)**
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    //go over what we pass in and why we call handleError here
    //if it gets called in sendPost()**
    //why do we need the check in sendPost then**
    if(!username || !pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2});

    //why do we return false**
    return false;
}

//do we capitalize JSX files like this otherwise it will not work**
//why do we not have a closing input here because we are allowed to have
//a closing input**

// Now that we have these event handlers, we can create our React components that will
// use them. Since this is a simple component that will not update when the user types
// into it, we will make a “functional stateless component” or FSC. Add the following to
// login.jsx. Note that we have proper syntax highlighting for the JSX since this is a .jsx
// file.**
// go over all**
// why do we still need the action is it because we still use it in the server
// and in router.js to go to specific methods and we put this
// into the content section in the .handlebars files where it then
// gets used in the server for the pathname or how does it work**
// why do we not have action in the handlebars files anymore**
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

//do we still need to put props as a parameter even though we do not
//use any attribtues (props. name of attribute)**
//in init where they should be within the <> with root.render**
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
// components get rendered when they are clicked 
// We will do this in an init function that
// gets called when the window loads. We will also tell it to render the LoginWindow
// immediately so that there is something on the page when the user first loads it. You’ll
// note that we are using the new React 18 “createRoot” syntax here to make a React
// Root to render things.
const init = () => {

    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    //go over create root**
    const root = createRoot(document.getElementById('content'));

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

    root.render( <LoginWindow />);

    //why do we not call sendPost() here but we do in maker.JSX
    //is it because we call it in the loginWindow and the
    //signupWindow function from the HTML above
    //which contains the sendPost()** but in maker.JSX we do not have that
    //so we have to call it directly in init()**
};

window.onload = init;
