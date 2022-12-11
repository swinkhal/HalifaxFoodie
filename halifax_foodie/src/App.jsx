import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import FoodReview from "./Components/FoodReview";
import MultiFactor from "./Components/MultiFac";
import ChatMod from "./Components/ChatMod";
import RestaurantHome from "./Components/RestaurantHome";
import CustomerHome from "./Components/CustomerHome";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Feedback from "./Components/Feedback";
import UploadRecipe from "./Components/UploadRecipe";
import RestaurantRecipes from "./Components/RestaurantRecipes";
import ViewRecipesCustomer from "./Components/ViewRecipesCustomer";
import GiveFeedback from "./Components/GiveFeedback";
import ViewSimilarRecipes from "./Components/ViewSimilarRecipes";
import Visualization from "./Components/Visualization";
import "../src/baseClass.css";
import './App.css'

function App() {
  return (
    <>
      {!JSON.parse(localStorage.getItem("IsQuestion")) ? (
        <Router>
          <Switch>
            <Route exact path="/" component={MultiFactor} />
          </Switch>
        </Router>
      ) : (
        <Router>
          <Switch>
            <Route exact path="/question" component={MultiFactor} />
            {!JSON.parse(localStorage.getItem("Role") == "customer") ? (
              <Route exact path="/" component={RestaurantHome} />
            ) : (<Route exact path="/" component={CustomerHome} />)}

            <Route exact path="/question" component={MultiFactor} />
            <Route exact path="/giveratings" component={FoodReview} />
            <Route exact path="/chatRoom" component={ChatMod} />
            <Route exact path="/feedback" component={Feedback} />
            <Route exact path="/uploadRecipe" component={UploadRecipe} />
            <Route exact path="/ourRecipes" component={RestaurantRecipes} />
            <Route exact path="/viewRecipes" component={ViewRecipesCustomer} />
            <Route exact path="/giveFeedback" component={GiveFeedback} />
            <Route exact path="/similarRecipes" component={ViewSimilarRecipes} />
            <Route exact path="/visualization" component={Visualization} />
          </Switch>
        </Router>
      )}
    </>
  );
}

export default withAuthenticator(App);