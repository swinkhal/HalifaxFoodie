import React, {useState, useRef} from 'react'
import { Button, OutlinedInput } from '@mui/material';
import db from "../firebase";
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SendMessage from './SendMessage'
import axios from 'axios';
import { NavLink } from 'react-router-dom';


export default function CreateRoom({currentUser: loggedInUser, chatWith: userToChat}) {
    let [pageVal, setPageVal] = useState("");
    let messageByUser='';
    let messageToUser='';

    if(loggedInUser.role.toLowerCase() === 'customer'){
        messageByUser=loggedInUser.email;

    }
    else{
        messageByUser='restaurant';
    }

     if(userToChat){
        messageToUser=userToChat.email;

    }
    else{
        messageToUser='restaurant';
    }

    // let messageByUser = loggedInUser.role.toLowerCase() === 'customer' ? loggedInUser.email : 'restaurant'
    //let messageToUser = userToChat ? userToChat.email : 'restaurant'
    let texts = db.collection("messages");
    //https://firebase.google.com/docs/firestore/query-data/queries
    let queryForChat = texts.where('sentBy', 'in', [messageByUser, messageToUser]).orderBy('createdAt')
    let [messages] = useCollectionData(queryForChat, { idField: "id" });

    let temp = useRef();

    //https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
   var setFalse  = async () => {

await axios

    .post("https://vpivmqqpa1.execute-api.us-east-1.amazonaws.com/default/updateflag",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
    }); 
   };

   
    var sendTextMsg  = async (e) => {
        e.preventDefault();

        try {
            await texts.add({
                text: pageVal,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                sentBy: messageByUser,
                sentTo: messageToUser
            });

            setPageVal("");
            temp.current.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
            console.log(error)
        }

    };

     function getTexts() {
        console.log(messages)
        if(!messages)return
        const setChatUsers = new Set([messageByUser, messageToUser]);
        console.log(setChatUsers)
        return messages.filter(message => setChatUsers.has(message.sentTo))
    }


    return (
        <>
        {/* /https://www.w3schools.com/tags/tag_main.asp */}
        <main>
            {getTexts() && getTexts().map((msg) => <SendMessage key={msg.id} message={msg} currentUser={loggedInUser} />)}
            <span ref={temp}></span>
        </main>

         {/* https://mui.com/material-ui/api/outlined-input/ */}
        <form onSubmit={sendTextMsg} className="textMsgs">
            
            <OutlinedInput
                placeholder="Enter text"
                onChange={(e) => setPageVal(e.target.value)} value={pageVal}/>

                <Button style={{marginLeft:'10%'}} type="submit" variant="contained" disabled={!pageVal} color="success" >
                    Send Msg
                </Button>

                    <NavLink style={{marginLeft:'15px'}} to={'/'} onClick={setFalse}> Close</NavLink>

   

        </form>
        </>
    );
}
