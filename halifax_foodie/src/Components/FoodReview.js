import React, { Component } from "react";
import { withRouter } from "react-router";
import axios from "axios";
import { Row, Button } from "react-bootstrap";

export class FoodReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //https://blog.logrocket.com/localstorage-javascript-complete-guide/
      user: JSON.parse(localStorage.getItem("user")),
      foodRating: "",
      itemId: props.location.state.foodId,
    };
  }
  onValueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  exit = (e) => {
    this.props.history.push("/orderFood");
  };
  
//https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
  saveRecipeItem = async (event) => {
    event.preventDefault();
    const itemBody = {
      ratings: this.state.foodRating,
      username: this.state.user.username,
      foodId: this.state.itemId,
    };

    try {
      let response = await axios.post(
        "https://vpivmqqpa1.execute-api.us-east-1.amazonaws.com/default/rate",

        JSON.stringify(itemBody),
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response)
      // this.cancel();
    } catch (error) {
      console.log(error)
    }
  };

  
  render() {
    return (
      <Row className="rating-content">
        <div>
          <h2>Please give your review</h2>
        </div>
        <div>
          <input
            type="text"
            palceholder="Add task"
            name="foodRating"
            value={this.state.foodRating}
            onChange={this.onValueChange}
          />
        </div>
        <div className="add-button">
          <Button className="primary-button" onClick={this.saveRecipeItem}>
            Submit
          </Button>
          <Button className="primary-button" onClick={this.exit}>
            Cancel
          </Button>
        </div>
      </Row>
    );
  }
}
export default withRouter(FoodReview);