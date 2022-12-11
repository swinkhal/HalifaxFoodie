import '../App.css';
import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk'
import { useHistory, useLocation } from 'react-router-dom';

// https://javascript.plainenglish.io/how-to-upload-files-to-aws-s3-in-react-591e533d615e

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const REGION = process.env.REACT_APP_REGION;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
})

function UploadRecipe() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [listOfRecipes, setListOfRecipes] = useState([]);
  let ingredients = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useHistory();
  const { state } = useLocation();
  const restaurantId = state.restaurantId;
  useEffect(() => {
    if (state == "" || state == null) {
      navigate.push('/');
    }
    else {
      const restaurantId = state.restaurantId


      const fetchRecipes = async () => {
        await fetch("https://dffogkrigyuqf5lgtd4iduroqy0imbqc.lambda-url.us-east-1.on.aws/", {
          // await fetch("https://g2wzzee4bt7vmp6kjs6lqcwbke0fcizb.lambda-url.us-east-1.on.aws/" , {
          method: "POST",
          body: JSON.stringify({
            restaurantId: restaurantId
          })
        })
          .then((res) => res.json()).then((res) => {

            if (res.status) {
              setListOfRecipes(res.data);
            }
            else {
              alert("Error in finiding Recipes.")
            }
          });
      }
      fetchRecipes();
    }
  }, []);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0])
  }

  const handleUpload = async (file) => {
    console.log(process.env.REACT_APP_S3_BUCKET)
    console.log(process.env.REACT_APP_ACCESS_KEY)

    const key = restaurantId + '/' + file.name

    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: key
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
      })
      .send((err) => {
        if (err) console.log(err)
      })
  }

  const extractKeyIngredients = async (file) => {
    const filename = file.name.split('.')[0]
    let res = await fetch("https://m4nuhbfvvxinyhjhw3t3bhfh640ukzbp.lambda-url.us-east-1.on.aws/", {
      method: "POST",
      body: JSON.stringify({
        filename: filename, restaurantId: restaurantId
      })
    }).then((res) => res.json()).then((res) => {
      if (res.status) {
        alert(res.message);
      }
      else {
        alert("Error in Extracting ingredients.")
      }
    })
  }

  return (
    <div className="home_title" align="center">
      <div><h1>Halifax Foodies</h1></div>
      <div><input type="file" onChange={handleFileInput} /></div>
      <br></br>
      <div><button disabled={!selectedFile} onClick={() => handleUpload(selectedFile)}> Upload</button>
        <button disabled={!selectedFile} onClick={() => extractKeyIngredients(selectedFile)}> Extract Key Ingedients</button></div>
      <div>
        <div className="home_title" align="center"><h2>Our Extracted Recipes</h2></div>
        <div align="center">
          {listOfRecipes.map((recipes) => {
            return (
              <div className="box" align="left">
                <h3>
                  Name : {recipes.RecipeName} <br></br>
                  Key Ingredients : {recipes.RecipeIngredients.map((i) => { { ingredients = ingredients + "," + i } return (<h4>{i}</h4>) })}
                  <button onClick={() => navigate.push('/similarRecipes', { ingredients: ingredients })}> View Similar Recipes</button>
                </h3>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UploadRecipe;