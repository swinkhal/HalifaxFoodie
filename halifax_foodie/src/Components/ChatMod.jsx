import React, { useEffect, useState } from "react";
import {useHistory} from 'react-router-dom'
import db from '../firebase'
//import { Auth } from "aws-amplify";
import CreateRoom from "./CreateRoom";
import './ChatMod.scss'

import { CardContent, Card, Typography, Grid, CardHeader } from "@mui/material";

//https://reactjs.org/docs/hooks-state.html
export default function ChatMod({sentBy}) {
    var [listCust, setCustList] = useState([])
    var [loggedInUser, setLoggedInUser] = useState(null)
    var [chosenCust, setChosenCust] = useState(null)

//https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        getLoggedInUser()
    }, [])

    let hist = useHistory();
    
//https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
    async function getLoggedInUser() {
        //https://www.w3schools.com/jsref/met_storage_setitem.asp
        let loggedInUserFromLS = localStorage.getItem('currentUser')
        console.log("bvyhyv*********",localStorage.getItem('currentUser'));
        if(!loggedInUserFromLS || loggedInUserFromLS === 'null') {
            hist.push('/')
            return
        }


        //https://www.w3schools.com/js/js_json_parse.asp
        var sang= JSON.parse(loggedInUserFromLS)
        setLoggedInUser(sang);
        console.log("***********",sang);

        if(loggedInUser?.role.toLowerCase() !== 'customer') {
            let users = await db.collection("users");
            let dataFromUser = await users.where("role", "==", 'customer').get();
            console.log(dataFromUser);
            var custData = []
            dataFromUser.forEach((doc) => {
                custData.push(doc.data())
            });
            console.log(custData)
            setCustList(custData)
        }
    }

  
    function GetListOfCust(props) {
        return (
            <div>
                {
                    props.customerList
                    && props.customerList.length
                    && props.customerList.map((customer, index) =>
                        <div key={index} onClick={(e) => getToChat(customer)}>
                            <FetchCust customer={customer}/>
                        </div>
                    )
                }

                {
                    props.customerList
                    && !props.customerList.length
                    &&
                    <h1 style={{color: 'grey'}}>
                        There are no customers !!!
                    </h1>
                }
            </div>
        )
    }

    //https://react-bootstrap.github.io/components/cards/
    function FetchCust(props) {
        return (
            <Card style={{marginBottom: '2rem'}}>
                <CardContent>
                    <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                        {props.customer.email}
                    </Typography>
                </CardContent>
            </Card>
        )
    }

   

    
    function title() {
        return <h2>Happy to help!</h2>
    }

    function getToChat(customer) {
        setChosenCust(customer)
    }

    // https://mui.com/material-ui/react-grid/
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" height={'90%'}>
            <Grid item={true} xs={2} sm={4} md={4}  className="chat-container">
                <Card variant="outlined">
                    <CardHeader style={{borderBottom: '1px solid lightgray'}} title={title()}/>
                    <CardContent>

                         {
                            !loggedInUser &&
                            <h1 style={{color: 'white', padding: '2rem'}}>
                                Customer List to be displayed ....
                            </h1>
                        }
                        {
                            loggedInUser && loggedInUser.role.toLowerCase() === 'customer' && <CreateRoom currentUser={loggedInUser}/>
                        }

                        {
                            loggedInUser && loggedInUser.role.toLowerCase() !== 'customer' && chosenCust && <CreateRoom currentUser={loggedInUser} chatWith={chosenCust} />
                        }

                        {
                            loggedInUser && loggedInUser.role.toLowerCase() !== 'customer' && !chosenCust && <GetListOfCust customerList= {listCust}/>
                        }

                       
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )

    }
