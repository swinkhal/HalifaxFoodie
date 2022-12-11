// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";

import firebase from "firebase";

const firebaseConfig = {
   apiKey: "AIzaSyBs36MTkDLMBwIsTDJnlisu3by55QUH1qo",
    authDomain: "serverlessproj-3b955.firebaseapp.com",
    projectId: "serverlessproj-3b955",
    storageBucket: "serverlessproj-3b955.appspot.com",
    messagingSenderId: "93397676800",
    appId: "1:93397676800:web:189614b8ec8dd1e16979e5"

};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
export default db;
