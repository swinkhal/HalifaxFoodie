import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import db from "../firebase";

// /https://reactjs.org/docs/hooks-state.html
export default function MFA() {
  let navigate = useHistory();

  let [registeredRole, setRegisteredRole] = useState("owner");

  let [secondFactorAns, setAns] = useState("");
  let [secondFactorQues, setQues] = useState();
  let questionForSecondFactor = "What is Your favorite movie?";

  let [thirdFacKey, setKey] = useState("  ");
  let [value, setValue] = useState("");
  let [thirdFacCipher, setCipher] = useState("");

  let databaseUser;
 
//https://reactjs.org/docs/hooks-effect.html
//https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
  useEffect(async () => {
    let databaseUser;

    !JSON.parse(localStorage.getItem("IsQuestion")) &&
      (await Auth.currentUserPoolUser().then((obj) => {
        const dbUser = {
          username: obj.username,
          email: obj.attributes.email,
        };
        console.log(dbUser, "**********")
        localStorage.setItem("user", JSON.stringify(dbUser));
        localStorage.setItem("IsQuestion", false);
      }));

      //https://blog.logrocket.com/localstorage-javascript-complete-guide/
    const user = JSON.parse(localStorage.getItem("user"));
    const users = await db.collection("users");
    const dataFromUser = await users.where("username", "==", user.username).get();

    dataFromUser.forEach((doc) => {
      databaseUser = doc.data();
    });
    console.log("dbUser",databaseUser);

    if (databaseUser) {
      setQues(true);
    } else {
      setQues(false);
    }
  }, []);

  const getCipherText =  async() => {
          var u = JSON.parse(localStorage.getItem("user"));

//sign-up third factor
      var tfBody = {
        email: u.email,
        userName: u.username,
        role: registeredRole,
        key: thirdFacKey,
        plainText: value,
      };
      console.log(tfBody);

      try {
        let result = await axios.post(
          "https://vpivmqqpa1.execute-api.us-east-1.amazonaws.com/default/ciphersignup",

          JSON.stringify(tfBody),
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(result);
        setCipher(result.data.body);
      } catch (error) {
        console.error(error);
      }  };

  //https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
  const onSubmitForm = async (e) => {
    e.preventDefault();

    console.log(secondFactorQues);
    if (secondFactorQues) {
      //https://blog.logrocket.com/localstorage-javascript-complete-guide/
      const user = JSON.parse(localStorage.getItem("user"));
      databaseUser = {};

      const users = await db.collection("users");
      const dataFromUser = await users.where("username", "==", user.username).get();

      dataFromUser.forEach((doc) => {
        databaseUser = doc.data();
      });

      if (databaseUser.answer) {
        if (secondFactorAns === databaseUser?.answer) {
          localStorage.setItem("IsQuestion", true);
          localStorage.setItem("Role", databaseUser.role);
        } else {
          alert("invalid answer");
        }
      }

      //login 3rd factor
      var tfLoginBody = {
        cipher: thirdFacCipher,
        username: user.username,
      };
      console.log(tfLoginBody);

      await axios
        .post(
          "https://vpivmqqpa1.execute-api.us-east-1.amazonaws.com/default/cipherlogin",

          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true",
              "Content-Type": "application/json",
            },
            crossDomain: true,
            body: JSON.stringify(tfLoginBody),
          }
        )
        .then((response) => {
          console.log(response);
          navigate.push("/");
          window.location.reload();
        })
        .catch((err) => {
          // Handle error
          console.log("error", err);
        });
    } else {
      var userExp = JSON.parse(localStorage.getItem("user"));

      // 2nd factor
      await Auth.currentAuthenticatedUser().then((obj) => {

                const user = {
                    username: userExp.username,
                    question: questionForSecondFactor,
                    answer: secondFactorAns,
                    role: registeredRole,
                    email:userExp.email
                }

                console.log("user:", user)
                db.collection('users').add(user)
                    .then((doc) => {
                        console.log("data Submitted Successfully.")
                        localStorage.setItem("IsQuestion", true)
                        localStorage.setItem("Role",registeredRole)

                        if(localStorage.getItem("Role") == "owner")
                        {
                          // navigate.push("/restaurantHome")
                          navigate.push("/")
                        }
                        else
                        { 
                          // navigate.push("/customerHome")
                          navigate.push("/")
                        }
                        // navigate.push("/")
                        window.location.reload()
                    })
                    .catch((err) => {
                        console.error("error:", err)
                    })
            }
            )


      
    }
  };

  return (
    <>
      <div className="all-content-center">
        <div className="container">
          <div className="center-box">
            <div className="main-box">
              <form onSubmit={(e) => onSubmitForm(e)}>
                <div className="mb-5">
                  {secondFactorQues ? (
                    <div></div>
                  ) : (
                    <div>
                      <div>
                        <h4>Enter your Role</h4>
                      </div>
                      <div>
                        <span>Enter your role</span>
                        <input
                          className="input-design top-space"
                          type="text"
                          value={registeredRole}
                          onChange={(e) => setRegisteredRole(e.target.value)}
                          placeholder="Customer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div></div>
                <div className="mb-5">
                  {secondFactorQues ? (
                    <h4>Second Factor</h4>
                  ) : (
                    <h4>Second Factor Auth setup</h4>
                  )}

                  <div className="cus-form form-top-space">
                    <span>What is Your favorite movie?</span>
                    <input
                      className="input-design top-space"
                      type="text"
                      value={secondFactorAns}
                      onChange={(e) => setAns(e.target.value)}
                      placeholder="Answer"
                    />
                  </div>
                </div>

                <div></div>

                <div className="mb-5">
                  {secondFactorQues ? (
                    <div><h4>Third Factor</h4>
                    <div className="cus-form form-top-space">
                    <span>Enter cipher: </span>
                    <input
                      className="input-design top-space"
                      type="text"
                      value={thirdFacCipher}
                      onChange={(e) => setCipher(e.target.value)}
                      placeholder="Enter cipher"
                    />
                  </div></div>
                  ) : (
                    <div><h4>Third Factor Auth setup</h4>
                    <div className="cus-form form-top-space">
                    <span>Enter key: </span>
                    <input
                      className="input-design top-space"
                      type="text"
                      value={thirdFacKey}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter your key"
                    />
                  </div>

                  <div className="cus-form form-top-space">
                    <span>Enter value:</span>
                    <input
                      className="input-design top-space"
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter you value"
                    />
                  </div>
                 <Button onClick={getCipherText}>Generate Cipher</Button>

                    <span>{thirdFacCipher}</span>
                
                  </div>
                  )}
                
                  
                </div>

                <div className="cus-form form-top-space">
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


