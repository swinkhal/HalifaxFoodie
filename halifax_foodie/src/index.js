import React from "react";
import ReactDOM from "react-dom/client";
// import ReactDOM from "react-dom";
import { BrowserRouter as Router} from 'react-router-dom';

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";

import { Amplify } from "aws-amplify";
import config from "./aws-exports";
import LexChat from "react-lex";

Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Router>
    <App />
    <LexChat
      botName="NavigationHelp"
      IdentityPoolId="us-east-1:deaf2ce8-6aef-4d71-b1b3-a64e51675264"
      placeholder="Placeholder text"
      backgroundColor="#FFFFFF"
      height="430px"
      region="us-east-1"
      headerText="Need Help?"
      headerStyle={{ backgroundColor: "#ABD5D9", fontSize: "30px" }}
      greeting={
        "Hello, how can I help? You can say things like 'help' to get more info"
      }
    />  
    </Router>

);


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//     <LexChat
//       botName="NavigationHelp"
//       IdentityPoolId="us-east-1:deaf2ce8-6aef-4d71-b1b3-a64e51675264"
//       placeholder="Placeholder text"
//       backgroundColor="#FFFFFF"
//       height="430px"
//       region="us-east-1"
//       headerText="Need Help?"
//       headerStyle={{ backgroundColor: "#ABD5D9", fontSize: "30px" }}
//       greeting={
//         "Hello, how can I help? You can say things like 'help' to get more info"
//       }
//     />  
//   </React.StrictMode>,
//   document.getElementById("root")
// );

reportWebVitals();