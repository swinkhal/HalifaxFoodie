import '../App.css';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
window.Buffer = window.Buffer || require("buffer").Buffer;

function GiveFeedback() {
    const navigate = useHistory();
    const { state } = useLocation();
    const [feedback, setFeedback] = useState("");
    const restaurantId = state.restaurantId
    const state1 = JSON.parse(localStorage.getItem("user"))
    const userId = state1.email

    if (state == "" || state == null) {
        navigate.push('/');
    }
    else {
        const restaurantId = state.restaurantId
        console.log(restaurantId)
        const giveFeedbacktoRes = async () => {
            // https://www.freecodecamp.org/news/fetch-data-react/
            await fetch("https://czv4qrzjyxswse2tsyma7kbsfa0mymuv.lambda-url.us-east-1.on.aws/", {
                method: "POST",
                body: JSON.stringify({
                    restaurantId: restaurantId,
                    feedback: feedback,
                    userId: userId
                })
            })
                .then((res) => {
                    if (res.status) {
                        alert("Feedback Given...")
                    }
                    else {
                        alert("Error in finiding feedbacks.")
                    }
                })
                .catch((error) => {
                });
        }

        return (

            <div>
                <div className="home_title" align="center"><h1>Halifax Foodies</h1></div>
                <div className="home_title" align="center"><h3>Restaurant Id : {restaurantId}</h3></div>
                <br></br>
                <div align="center">
                    <div>
                        <form>
                            <div>
                                <input type="text" id="feedback" name="feedback" onChange={(e) => setFeedback(e.target.value)} placeholder="Give Your Feedback"></input>
                            </div>
                        </form>
                    </div>
                    <div>
                        <button onClick={() => { giveFeedbacktoRes() }}> Give Feedback</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default GiveFeedback;