import '../App.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function Feedback() {
  const [listOfFeedbacks, setListOfFeedbacks] = useState([]);
  const { state } = useLocation();
  const navigate = useHistory();

  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    if (state == "" || state == null) {
      navigate.push('/');
    }
    else {
      const restaurantId = state.restaurantId
      const fetchFeedbacks = async () => {
        // https://www.freecodecamp.org/news/fetch-data-react/
        await fetch("https://6ne2nruzlq4jhd5a7sjylfk4oq0qxlgt.lambda-url.us-east-1.on.aws/", {
          method: "POST",
          body: JSON.stringify({
            restaurantId: restaurantId
          })
        })
          .then((res) => res.json()).then((res) => {
            if (res.status) {
              setListOfFeedbacks(res.data);
            }
            else {
              alert("Error in finiding feedbacks.")
            }
          })
      }
      fetchFeedbacks();
    }
  }, []);

  return (
    <div>
      <div className="home_title" align="center"><h1>Halifax Foodies</h1></div>
      <br></br>
      <div>
        <div className="home_title" align="center"><h2>User Feedbacks</h2></div>
        <div align="center">
          <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/06e60249-dd2c-4e70-bf8d-253263059ad9/page/LuG9C" ></iframe>
        </div>
      </div>
    </div>
  )
}

