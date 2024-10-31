
// Maker.jsx will contain all of our code for the application that shows up once the user
// has logged in. Login.js will handle everything before the user is logged in, like the login
// and signup screens. Helper.js will contain a number of helpful functions that both files
// will import.** (does this mean login.jsx instead of login.js)**

// Now open the client/maker.jsx file. We can require our helper file and react libraries
// here. Then we will add our React components for our Domo app. Node that we pass
// in onDomoAdded to handleDomo. We will call this function to update the domoList
// once a new domo has been added (go over)**
const helper = require('./helper.js');
const React = require('react');
//what do these do**
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const level = e.target.querySelector('#domoLevel').value;

    //go over what we pass in and why we call handleError above
    //if it gets called in sendPost()**
    //why do we need the check in sendPost then**
    if(!name || !age || !level){
        helper.handleError('All fields are required');
        return false;
    }

    //go over (what is e.target.action) and why do we add
    //a third parameter here now but not in login.JSX**
    helper.sendPost(e.target.action, {name, age, level}, onDomoAdded);
    return false;

}

// what are props for this file and login.JSX**
// Create a functional component in our client/maker.jsx to create our Add Domo form.
// This is very similar to our signup and login forms. Note that we are passing
// props.triggerReload to handleDomo’s second parameter. This will be a function we
// pass down when we render the component to help us know when to reload the domos
// from the server (go over)(we never say root.render like we do
// in login.JSX)**
// usually use the (e) event since this data can change or when do we use the (e)
// or not because we did not use it in login.JSX**
// what does the second parameter in handleDomo do**
const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >

            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="number" min="0" name="level" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />

        </form>
    );
};

// Now we will create a component to display our list of Domos. Note a few things. 1) We
// are storing our domos array using the useState hook so that we can update and
// rerender the list. 2) We have an effect that loads the domos from the server and
// updates the state. 3) That useEffect hook has props.reloadDomos as a dependency in
// it’s dependency list. This means whenever that variable changes, we will load the
// domos from the server again. We will update this variable using the 2 nd parameter of
// handleDomo (onDomoAdded) (we never call handleDomo here)** (which we already started hooking up).
// go over**
const DomoList = (props) => {
    //where do we set setDomos**
    //go over**
    //what is props.domos because we never do a root.render with the <>
    //and the attribute within the <> in init**
    //is setDomos a function we make different each time we use it because
    //we first make it get the list of domos then in the delete
    //we filter out the domo we deleted based on the id then update the array
    //of domos (the domos variable)**
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    const handleDelete = async (id) => {
        helper.sendDelete(`/deleteDomo/${id}`, (result) => {
            // If result.message exists (successfult)**
            // setDomos is called to update the components 
            // state by removing the deleted Domo from the list of domos
            // setDomos(domos.filter((domo) => domo._id !== id)); 
            // filters out the Domo with the matching _id, 
            // creating a new array without it setDomos then
            // updates the state to re-render the component 
            // with the updated list of domos
            if(result.message){
                setDomos(domos.filter((domo) => domo._id !== id));
            }
        });
    }

    //when we have no domos**
    if(domos.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    //when domos exist we return the list of domos**
    const domoNodes = domos.map(domo => {
        return(
            //each domo has an id based on the session or is it when we 
            //connected the _id in account.js in models and controllers with the username
            //and why do we not say .session.account._id**
            <div key={domo.id} className="domo">
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Age: {domo.level}</h3>
            </div>
        );
    });

    //when does this case get used because we already have a return above**
    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
};


// Now that we have our DomoForm and DomoList functions, we need a way to make
// the DomoList’s effect rerender when the DomoForm submits something to the server.
// To do that, we need a higher level component called <App>. Inside of app, we will
// create a stateful variable called reloadDomos that is just a boolean. When we render
// out our DomoForm, we create a triggerReload prop. It is a function that calls
// setReloadDomos, and passes in the negation of reloadDomos that way it toggles it
// every time it gets called. We also pass reloadDomos into the DomoList, which gets
// used in it’s useEffect dependency list (there is no useEffect here)**
// So every time DomoForm submits a new domo,
// triggerReload inverts the reloadDomos Boolean, and the effect fires again because
// the Boolean has changed. Then we render out the app component to the screen.
// go over**
const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return(
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoForm domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> )
}

window.onload = init;
