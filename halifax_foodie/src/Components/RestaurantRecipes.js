import '../App.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
window.Buffer = window.Buffer || require("buffer").Buffer;

function RestaurantRecipes() {
  const navigate = useHistory();
  const { state } = useLocation();
  const [listOfRecipes, setListOfRecipes] = useState([]);

  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    if (state == "" || state == null) {
      navigate.push('/');
    }
    else {
      console.log(state.restaurantID)
      const restaurantId = state.restaurantId
      console.log(restaurantId)

      const fetchRecipes = async () => {
        console.log(restaurantId)
        // https://www.freecodecamp.org/news/fetch-data-react/
        await fetch("https://7zyra5k7i7a4xtbc4ouscwrd7y0msfqc.lambda-url.us-east-1.on.aws/", {
          method: "POST",
          body: JSON.stringify({
            restaurantId: restaurantId
          })
        })
          .then((res) => res.json()).then((res) => {
            if (res.status) {
              setListOfRecipes(res.data);
            }
            else {
              alert("Error in finiding feedbacks.")
            }
          });
      }
      fetchRecipes();
    }
  }, []);

  return (
    <div>
      <div className="home_title" align="center"><h1>Halifax Foodies</h1></div>
      <br></br>
      <div>
        <div className="home_title" align="center"><h2>Our Recipes</h2></div>
        <div align="center">
          {listOfRecipes.map((recipes) => { return (<div class="box" align="left"><h3>Id : {recipes.RecipeID} <br></br> Name : {recipes.RecipeName} <br></br> Price : {recipes.RecipePrice} <br></br> Description : {recipes.RecipeDescription} </h3></div>) })}
        </div><br></br>
      </div>
    </div>
  )
}
export default RestaurantRecipes;