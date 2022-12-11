// https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#creating-an-item-in-dynamodb-from-lambda
const Add_AWS = require('aws-sdk');
const myClient = new Add_AWS.DynamoDB.DocumentClient();


//https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
async function getLexData(user_id, order_id){
  try {
const myParams = {
  TableName : 'order'
};
    //https://www.tabnine.com/code/javascript/functions/aws-sdk/DocumentClient/scan
    const scanData = await myClient.scan(myParams).promise();
    const dataFromDb= scanData.Items;
    for(var i = 0; i < dataFromDb.length; i++) {
      if(dataFromDb[i].userName==user_id)
      {
           if(dataFromDb[i].order_id==order_id)
           {

  //https://docs.aws.amazon.com/lex/latest/dg/what-is.html          
  return {"sessionAttributes": {
     "user_id": user_id,
    "order_id": order_id}, "dialogAction":{"type":"ElicitSlot",  "intentName": "AddRating", "slots":{"user_id": user_id, "order_id": order_id, "rating":""}, "slotToElicit": "rating" ,"message": { "contentType": "PlainText", "content": "Registered user. Provide your review."}}}
     }
    }
    }
 return {"dialogAction":{"type":"Close","fulfillmentState": "Failed","message": { "contentType": "PlainText", "content": "Auth Failed"}}}
   
  }
  catch (error) {
    }
}

//https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html#using-lambda-response-format
exports.handler = async (event, context) => {
    const user_id = event.currentIntent.slots.user_id;
    const order_id = event.currentIntent.slots.order_id;
    console.log(event);
    event.sessionAttributes = {
    "user_id": user_id,
    "order_id": order_id,
};
   // const order_id = event.sessionState.intent.slots.order_id.value.originalValue;
    const data = await getLexData(user_id, order_id);
    return data;
}  