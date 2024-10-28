/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/

//Remember since this is a client side JS file, it cannot communicate with the server 
//(MVC is all server side except the view)** unless it is through fetch() or a similar system.

// To build your client-side code into the bundle.js, run the following command in
// Powershell or Terminal: “npm run webpack”. Note that /hosted/bundle.js is now a built
// version of our client code that is automatically hosted as /assets/bundle.js because of
// our static file hosting line in app.js (go over webpack and bundle.js)**
// app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));**

//go over all**

// Now we need to make sure we can create accounts and login successfully.
// This is what the JS browser side will be doing
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('domoMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/

// A fair bit of functionality already exists here, mostly for the handling of POST requests
// made by the various forms in the different views. Note that our sendPost function is
// being used to send a fetch() request with a JSON body to the server (which is parsed
// by body parser). When a response comes back, we currently look for a redirect
// message or an error message from the server (from controllers in this case)**(go over)**
// Additionally, we have a hidden domoMessage div that appears when a message
// needs to be shown to the user.
// go over**
// do we come here first when we recieve a POST request only or where do we go first
// and we usually use the redirect (return res.json({ redirect: '/maker' });)
// in our server for POST requests only right****
const sendPost = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  //is domo message just images we show at one time with an error message or not**
  //is this file generalized to all the handlbars files or how does it know which one to access
  //is it because of the redirect link we get from controllers (not router.js) then doing the
  //action in that handlebars file to show the page**
  //why do we need this when it is already hidden by default in the handlebars files**
  document.getElementById('domoMessage').classList.add('hidden');

  //if we get back a response that says redirect we redirect to the page
  //and makes the request to the page to display it
  if(result.redirect) {
    window.location = result.redirect;
  }

  if(result.error) {
    handleError(result.error);
  }
};

/* Entry point of our client code. Runs when window.onload fires.
   Sets up the event listeners for each form across the whole app.
*/
//go over**
const init = () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const domoForm = document.getElementById('domoForm');
  const domoMessage = document.getElementById('domoMessage');

  /* If this page has the signupForm, add it's submit event listener.
     Event listener will grab the username, password, and password2
     from the form, validate everything is correct, and then will
     use sendPost to send the data to the server.
  */
 //we already put the checks in controllers account.js**
 //go over same for loginform and domoform**
 //why do we return false after doing sendPost() for all of them**
 //why do we add classlist hidden when they are already hidden in the HTML files**
 //checks server side to prevent creating an account from postman and 
 //we need validation server side to make sure someone is not making a malicious attack
 //and we need it server side so we do not have to go
 //all the way to the server to check when we could check in the client instead
  if(signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      domoMessage.classList.add('hidden');

      const username = signupForm.querySelector('#user').value;
      const pass = signupForm.querySelector('#pass').value;
      const pass2 = signupForm.querySelector('#pass2').value;

      if(!username || !pass || !pass2) {
        handleError('All fields are required!');
        return false;
      } 

      if(pass !== pass2) {
        handleError('Passwords do not match!');
        return false;
      }

      sendPost(signupForm.getAttribute('action'), {username, pass, pass2});
      return false;
    });
  }

  /* If this page has the loginForm, add it's submit event listener.
     Event listener will grab the username, password, from the form, 
     validate both values have been entered, and will use sendPost 
     to send the data to the server.
  */
  if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      domoMessage.classList.add('hidden');

      const username = loginForm.querySelector('#user').value;
      const pass = loginForm.querySelector('#pass').value;

      if(!username || !pass) {
        handleError('Username or password is empty!');
        return false;
      }

      sendPost(loginForm.getAttribute('action'), {username, pass});
      return false;
    });
  }

  /* If this page has the domoForm, add it's submit event listener.
     Event listener will grab the domo name and the domo age from
     the form. It will throw an error if one or both are missing.
     Otherwise, it will send the request to the server.
  */
 //this sends us to send post then we make the request a JSON object then
 //we sent it to the server (await fetch())****
 //to the do the rest in the server (models and views) then we wait for the response
 //from the server and convert the response to JSON
 //(const result = await response.json();) then redirect the user
 //to the correct page on the browser****
 //go over in terms of diagram on photo****
  if(domoForm) {
    domoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      domoMessage.classList.add('hidden');

      const name = domoForm.querySelector('#domoName').value;
      const age = domoForm.querySelector('#domoAge').value;

      if(!name || !age) {
        handleError('All fields are required!');
        return false;
      }

      //goes to /maker for action** (can only have one action when working
      //like this)**
      //fetch call expects a response in JSON for domo form or 
      //sendPost()(all forms are JSON since the schemas are in JSON already in models
      //and we work with that in the controllers files)**

      //makes a fetch request to the server based on the action then the data is given back 
      //from the server then we can display it 
      sendPost(domoForm.getAttribute('action'), {name, age});
      //how did we know to return false****
      return false;
    });
  }
};

// Call init when the window loads.
window.onload = init;