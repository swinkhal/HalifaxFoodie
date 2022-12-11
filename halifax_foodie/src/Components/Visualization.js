import '../App.css';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
window.Buffer = window.Buffer || require("buffer").Buffer;

function Visualization() {
  const navigate = useHistory();
  const { state } = useLocation();
  
  const state1 = JSON.parse(localStorage.getItem("user"))

  const userId = state1.email

  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    if (state == "" || state == null) {
      navigate.push('/');
    }
    else {
      const restaurantId = state.restaurantId
      const fetchFeedbacks = async () => {
        // https://www.freecodecamp.org/news/fetch-data-react/
        await fetch("https://uvbxfjihnby63d7gtptjig3ciq0jliqt.lambda-url.us-east-1.on.aws/", {
          method: "POST",
          body: JSON.stringify({
            restaurantId: restaurantId
          })
        })
          .then((res) => res.json()).then((res) => {
            if (res.body) {
              
            }
            else {
              console.log("error")
            }
          })
          await fetch("https://mged25tyh5uhntkoqjvo5bdpmu0crdpz.lambda-url.us-east-1.on.aws/", {
          method: "POST",
          body: JSON.stringify({
            restaurantId: restaurantId
          })
        })
          .then((res) => res.json()).then((res) => {
            if (res.body) {
              
            }
            else {
              console.log("error")
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
        <div className="home_title" align="center"><h2>Visualization</h2></div>
        <div align="center">
        {/* <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/null" frameborder="0" style={{border: 0}} allowFullScreen></iframe> */}
        <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/e95ba424-da62-4fa6-a8c4-6a241c017a72/page/BIZ9C" frameborder="0" style={{border: 0}} allowFullScreen></iframe>
        <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/04c315c1-f53f-47fa-ab0c-9c917aa761df/page/sGZ9C" frameborder="0" style={{border: 0}} allowFullScreen></iframe>
        </div>
      </div>
    </div>
  )
}
export default Visualization;