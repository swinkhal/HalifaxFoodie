//https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#creating-an-item-in-dynamodb-from-lambda
const Add_AWS = require('aws-sdk');
const myClient = new Add_AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
    
    const p = {                    
  TableName : 'flag'
};
    const stuData = await myClient.scan(p).promise();
    const dynamoData= stuData.Items;
    console.log(dynamoData)
    var flag;
      if(dynamoData[0].ID=='1')
      {
          if(dynamoData[0].chck==true)
          {
              flag="true"
          }
          else
          {
              flag="false"
          }
      }
    const response = {
        statusCode: 200,
        body: JSON.stringify(flag),
    };
    return response;
}