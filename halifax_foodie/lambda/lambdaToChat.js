var aws = require("aws-sdk");
aws.config.update({region: 'us-east-1'});
const myClient = new aws.DynamoDB.DocumentClient();
//https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.UpdateItem.html
exports.handler = async (event) => {                           
   const params = {
    TableName: 'flag',
    Key: {
      ID: '1',
    },
    UpdateExpression: 'set chck = :r',
    ExpressionAttributeValues: {
      ':r': true,
    },
  };



 await myClient.update(params).promise();
    return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled","message": { "contentType": "PlainText", "content": "Initiating a Chatroom.."}}}



};