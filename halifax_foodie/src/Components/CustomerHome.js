import '../App.css';
import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
window.Buffer = window.Buffer || require("buffer").Buffer;



function CustomerHome() {
  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const { state } = useLocation();
  const navigate = useHistory();
  let [loggedInUser, setLoggedInUser] = useState(null);
  console.log(localStorage.getItem("Role"))

  useEffect(() => {
    let timeInt = setInterval(() => {
      flagChk();
    }, 15000);
    return () => clearInterval(timeInt);
  },[]);

//https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook

  async function flagChk() {
    await axios
    .post(
      "https://vpivmqqpa1.execute-api.us-east-1.amazonaws.com/default/getflag",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  .then((response) => {
      var chck=JSON.parse(response.data.body)
      if(chck!="false")
      {
        navigate.push("/chatRoom");
        window.location.reload();
      }
    });    
  }

  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    getLoggedInUser()
    if (localStorage.getItem("IsQuestion") && localStorage.getItem("Role") == "customer") {
      const fetchRestaurant = async () => {
        // https://www.freecodecamp.org/news/fetch-data-react/
        await fetch("https://nsltfuxna4who3jwvu7pbq72si0jciyv.lambda-url.us-east-1.on.aws/", {
          method: "POST",
          body: JSON.stringify({

          })
        })
          .then((res) => res.json()).then((res) => {
            if (res.status) {
              setListOfRestaurants(res.data);
            }
            else {
              alert("Error in fetching restaurants.")
            }
          })
      }
      fetchRestaurant();
    }
    else {
      logOut();
    }
  }, []);

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
    navigate.push('/');
  };

  return (
    <div className="home_title" align="center">
      <div><h1>Halifax Foodies</h1></div>
      <div><button onClick={() => logOut()}>Log Out</button></div>
      <div>
        <table id="restaurants">
          <tr>
            <th>Restaurant Name</th>
            <th>Restaurant Id</th>
            <th>Contact</th>
            <th>Address</th>
            <th>View Food items</th>
            <th>Give Feedback</th>
          </tr>
          {listOfRestaurants.map((restaurants) => {
            return (
              <tr>
                <td>{restaurants.restaurantName}</td>
                <td>{restaurants.restaurantId}</td>
                <td>{restaurants.restaurantContact}</td>
                <td>{restaurants.restaurantAddress}</td>
                <td><button onClick={() => navigate.push('/viewRecipes', { restaurantId: restaurants.restaurantId })}> View Recipes</button></td>
                <td><button onClick={() => navigate.push('/giveFeedback', { restaurantId: restaurants.restaurantId })}> Give Feedback</button></td>
              </tr>
            )
          })}
        </table>
      </div>
    </div>
  )
}
export default CustomerHome;