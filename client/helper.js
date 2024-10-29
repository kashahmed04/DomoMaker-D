
//how does it know which file to grab the elements from to display the message**
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
};

// We want to change sendPost to make it a little more versatile (adaptive). We will be modifying
// the version in helper.js. This new version will take in a third parameter called handler.
// This will be a function we can pass in to add functionality to handling requests. We call
// it at the bottom of sendPost, provided we passed something in for it.**
// go over handler**

// We will also make a hideError helper function to hide the error popup. We can then
// export these functions from helper.js. Remember that we can use the same module
// require syntax in our client code as we do in our server code because webpack will
// convert the code for us.
// this only works because of webpack right not in general**
// do we pass in a handler if there is a specific error but if there is not
// we do not have to pass in handler when calling sendPost() from our JSX files
// only** and we can use the default error handling in handleError()**
// if we do not pass in a handler what is the default value for it**
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();

    document.getElementById('domoMessage').classList.add('hidden');

    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    //go over example of this**
    if(handler){
        handler(result);
    }
};

//why do we hide this twice if it's hidden by default in app.handlebars**
const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
};
  
module.exports = {
    handleError,
    sendPost,
    hideError,
}