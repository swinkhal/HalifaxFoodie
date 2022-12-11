import '../App.css';
import React, { useState, useEffect } from 'react';
import {  useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
window.Buffer = window.Buffer || require("buffer").Buffer;

function RestaurantHome() {
  const navigate = useHistory();
  let [loggedInUser, setLoggedInUser] = useState(null);
  const getLoggedInUserRole = localStorage.getItem("Role");

  const state1 = JSON.parse(localStorage.getItem("user"))
  const restaurantId = state1.email


  console.log(restaurantId)

  //https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    getLoggedInUser()
    if (localStorage.getItem("IsQuestion") && localStorage.getItem("Role") == "owner") {

    }
    else {
      logOut();
    }
  }, [])

  //https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
  async function getLoggedInUser() {
    try {
      let getUser = await Auth.currentAuthenticatedUser({
        bypassCache: false
      })
      setLoggedInUser({ ...getUser.attributes, role: getUser.storage?.getItem('Role') });
      localStorage.setItem('currentUser', JSON.stringify({ ...getUser.attributes, role: getUser.storage?.getItem('Role') }))
    } catch (error) {
      navigate.push('/')
    }
  }

  let logOut = () => {
    localStorage.clear();
    window.location.reload();
    navigate.push("/");
  };

  return (
    <div className="home_title" align="center">
      <div><h1>Halifax Foodies</h1></div>
      <div><br></br><br></br>
        <button onClick={() => navigate.push('/chatRoom', { restaurantId: restaurantId })}> Chat </button> <br></br><br></br>
        <button onClick={() => navigate.push('/uploadRecipe', { restaurantId: restaurantId })}> Upload Recipe</button> <br></br><br></br>
        <button onClick={() => navigate.push('/feedback', { restaurantId: restaurantId })}> Get Feedback</button> <br></br><br></br>
        <button onClick={() => navigate.push('/ourRecipes', { restaurantId: restaurantId })}>Our Recipes</button><br></br><br></br>
        <button onClick={() => navigate.push('/visualization', { restaurantId: restaurantId })}>Visualize</button><br></br><br></br>
        <button onClick={() => logOut()}>Log Out</button>
      </div>
    </div>
  )
}
export default RestaurantHome;