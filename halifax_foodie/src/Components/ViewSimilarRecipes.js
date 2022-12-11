import '../App.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
window.Buffer = window.Buffer || require("buffer").Buffer;

function ViewSimilarRecipes() {
  const navigate = useHistory();
  const { state } = useLocation();
  const [listOfRecipes, setListOfRecipes] = useState([]);

  const [listOfRec, setListOfRec] = useState([]);
  const [listOfResId, setListOfRestId] = useState([]);
  const [labelOfRecipe, setLabelOfRecipe] = useState("");
  const [modelOutput, setModelOutput] = useState([]);
  const restaurantId = state.restaurantId;

  const state1 = JSON.parse(localStorage.getItem("user"))

  const userId = state1.email

  const getLabelForAllRecipes = async (ingredients) => {
    
    // https://www.freecodecamp.org/news/fetch-data-react/
    await fetch("https://us-central1-serverlessprojectgroup5.cloudfunctions.net/PredictSimilarRecipes", {
      method: "POST",
      body: JSON.stringify({
        text: ingredients
      })
    })
      .then((res) => res.json()).then((res) => {
        if (res.length) {
          if(res[0].confidence > res[1].confidence)
          {
            // https://beta.reactjs.org/learn/updating-arrays-in-state
            setModelOutput(m=> [...m, "VEG"]);
          }
          else{
            // https://beta.reactjs.org/learn/updating-arrays-in-state
            setModelOutput(m=>[...m, "NON-VEG"]);
          }
        }
        else {
          alert("Error in finiding feedbacks.")
        }
      });
      console.log("modelOutput : ", modelOutput)
  }

  const getLabel = async (ingredients) => {
    
    // https://www.freecodecamp.org/news/fetch-data-react/
    await fetch("https://us-central1-serverlessprojectgroup5.cloudfunctions.net/PredictSimilarRecipes", {
      method: "POST",
      body: JSON.stringify({
        text: ingredients
      })
    })
      .then((res) => res.json()).then((res) => {
        if (res.length) {
          if(res[0].confidence > res[1].confidence)
          {
            setLabelOfRecipe("VEG");
          }
          else{
            setLabelOfRecipe("NON-VEG");
          }
        }
        else {
          alert("Error in finiding feedbacks.")
        }
      });
      console.log("Label : ", labelOfRecipe);
  }

  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    if (state == "" || state == null) {
      navigate.push('/');
    }
    else {
      const ingredients = state.ingredients

      const fetchAllRecipes = async () => {
        // https://www.freecodecamp.org/news/fetch-data-react/
        await fetch("https://nfeqvjhkjhzexerehls4dm3eau0wlyfw.lambda-url.us-east-1.on.aws/", {
          method: "POST",
          body: JSON.stringify({
            restaurantId: restaurantId
          })
        })
          .then((res) => res.json()).then((res) => {
            if (res.status) {
              setListOfRecipes(res.data);
              console.log(listOfRecipes)
            }
            else {
              alert("Error in finiding Recipes.")
            }
          });

      }

      getLabel(ingredients);
      fetchAllRecipes();

    }
  }, []);

  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    console.log("list of recipes: ", listOfRecipes);
    let ingredients = [];
    if (listOfRecipes.length > 0) {
      listOfRecipes.forEach(list => {
        let recipe = list.RecipeIngredients.join(",");
        let recipeName = list.RecipeName;
        let restaurantId = list.ResId;
        ingredients.push(recipe);
        listOfRec.push(recipeName);
        listOfResId.push(restaurantId);
      });

      console.log("ingredients: ", ingredients);
      console.log("listOfRec: ", listOfRec);
      console.log("listOfResId: ", listOfResId);
      
      ingredients.forEach(ingredientsElement => {
        getLabelForAllRecipes(ingredientsElement)
      })
    }
  }, [listOfRecipes])


  return (
    // https://stackoverflow.com/questions/59089249/react-incrementing-variable-within-map-function
    <div>
      <div className="home_title" align="center"><h1>Halifax Foodies</h1></div>
      <br></br>
      <div>
        <div className="home_title" align="center"><h2>Similar Recipes</h2></div>
        <div align="center">
        {modelOutput.length > 0 && modelOutput.map((label, index) => {
          return label === labelOfRecipe ? (
            <div className="box" align = "left">
              <h3>
                Recipe Name :  {listOfRec[index]}<br></br>
                Restaurant Id : {listOfResId[index]}
                {index = index+1}
              </h3>
            </div>
          ) : "No recipes found!!"
        })}
        </div>
      </div>
    </div>
  )
}
export default ViewSimilarRecipes;