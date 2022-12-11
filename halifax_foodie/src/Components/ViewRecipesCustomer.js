import '../App.css';
import React , {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useHistory, Link, useLocation} from 'react-router-dom';
import {  Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import axios from "axios";
window.Buffer = window.Buffer || require("buffer").Buffer;

function ViewRecipesCustomer() 
{
  const navigate = useHistory();
  const { state } = useLocation();
  const [listOfRecipes, setListOfRecipes] = useState([]);
  const restaurantId = state.restaurantId

  const state1 = JSON.parse(localStorage.getItem("user"))
  
  const userId = state1.email

  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    if( state == "" || state == null){
    navigate.push('/');
    }
    else{
        const restaurantId = state.restaurantId

        const fetchRecipes = async () =>{
          // https://www.freecodecamp.org/news/fetch-data-react/
            await fetch("https://7zyra5k7i7a4xtbc4ouscwrd7y0msfqc.lambda-url.us-east-1.on.aws/" , {
            method: "POST",
            body: JSON.stringify({
            restaurantId: restaurantId
            })
        })
        .then((res) => res.json()).then((res)=>{
            if(res.status){
                setListOfRecipes(res.data);
            }
            else{
            alert("Error in finiding feedbacks.")
            }
        }); 
        }
        fetchRecipes();
    }
}, []);


//https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
async function orderFoodFromRestaurant(row) {
    const itemBody = {
        foodName: row["RecipeName"],
        foodId: row["RecipeID"],
        price: row["RecipePrice"],
        userName: userId,
        restaurantId: state.restaurantId,
   
    };
  
    try {
      let result = await axios.post(
        "https://vpivmqqpa1.execute-api.us-east-1.amazonaws.com/default/addorder",
  
        JSON.stringify(itemBody),
        { headers: { "Content-Type": "application/json" } }
      );
      
      alert("Ordered " + row["RecipeName"] + " Successfully");
      this.props.history.push("/giveratings", { foodId: itemBody.foodId });
    } catch (error) {
    }
  }

  return ( 
    <div>
        <div className="home_title" align = "center"><h1>Halifax Foodies</h1></div>
        <br></br>
        <div>
          <div className="home_title" align = "center"><h2>Our Recipes</h2></div>
          <div align = "center">
              {listOfRecipes.map((recipes) => {
                        return (
                <div class="box" align = "left">
                    <h3>Name : {recipes.RecipeName} 
                    <br></br> Price : {recipes.RecipePrice} 
                    <br></br> Description : {recipes.RecipeDescription} 
                    <br></br> Id : {recipes.RecipeID}
                    </h3>
                    <div align = "center">
                        <Button className="add-button" onClick={() => orderFoodFromRestaurant(recipes)} >
                            Place Order
                        </Button>
                    </div>
                </div>)})}
          </div>
        </div>
    </div>
  )
}
export default ViewRecipesCustomer;