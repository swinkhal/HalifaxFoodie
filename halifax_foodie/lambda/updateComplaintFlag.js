//https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#creating-an-item-in-dynamodb-from-lambda
var getSDK = require("aws-sdk");
getSDK.config.update({region: 'us-east-1'});
const client = new getSDK.DynamoDB.DocumentClient();               

exports.handler = async (event) => {
    const param = {
    TableName: 'flag',
    Key: {
      ID: '1',
    },
    //https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html
    UpdateExpression: 'set chck = :r',
    ExpressionAttributeValues: {
      ':r': false,
    },
  };


 await client.update(param).promise();
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};