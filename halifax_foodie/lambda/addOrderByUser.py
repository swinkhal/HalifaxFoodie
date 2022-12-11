import boto3
import json
import random

def lambda_handler(event, context):
   #https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
    if (event):
        genarateId = random.randint(10, 100000)
        getTable = boto3.resource('dynamodb')
        data=event
        recipe =data['recipe']
        recipeId = data['recipeId']
        userName = data['userName']
        recipePrice = data['recipePrice']
  
        
        orderData = getTable.Table("order")
        if(len(data)!=0):
          #https://binaryguy.tech/aws/dynamodb/put-items-into-dynamodb-table-using-python/
             response = orderData.put_item(
                Item={
                  'name' :recipe,
                  'recipeId':recipeId,
                  'order_id': str(genarateId),
                  'userName':userName,
                  'recipePrice':recipePrice,
                  'orderStatus':"Preparing"
                })
        
        print(response)
        return {
            'statusCode': 200,
            'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
            'body': json.dumps('Hello from Lambda!')
        }
