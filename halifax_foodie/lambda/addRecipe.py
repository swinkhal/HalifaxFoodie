import json
import boto3
import random
import re

def lambda_handler(event, context):
    if (event):
        print(event)
        generateId = random.randint(10, 100000)
        #https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
        getTable = boto3.resource('dynamodb')
        flag=0
        print(event)
        owner_id= event['currentIntent']['slots']['res_id']
        recipe_name=event['currentIntent']['slots']['recipe_name']
        recipe_desc= event['currentIntent']['slots']['recipe_desc']
        price=event['currentIntent']['slots']['price']
        
        userTable = getTable.userTable('user')
        response = userTable.scan();
        
        #https://stackoverflow.com/questions/63677465/check-if-a-value-exists-in-dynamodb-userTable-using-python-and-fetch-that-record
        for i in response['Items']:
            if(i['email']==owner_id and i['role']=="owner"):
                flag=1
            else:
                flag=0
            #print(i)
        
        if(flag):
            recipeTable = getTable.userTable("recipe")
            if(len(recipe_name)!=0):
                #https://binaryguy.tech/aws/dynamodb/put-items-into-dynamodb-userTable-using-python/
                 response = recipeTable.put_item(
                    Item={
                      'id':str(generateId),    
                      'restaurant_id':owner_id,
                      'recipe_name' :recipe_name,
                      'recipe_desc':recipe_desc,
                      'price': price
                    })
            
            #https://docs.aws.amazon.com/lex/latest/dg/what-is.html
            return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled","message": { "contentType": "PlainText", "content": "Recipe has been added. Thanks!."}}}

            return {
                'statusCode': 200,
                'headers': {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                            },
                'body': json.dumps('Hello from Lambda!')
            }
        else:
            return {"dialogAction":{"type":"Close","fulfillmentState": "Failed","message": { "contentType": "PlainText", "content": "Restaurant not found."}}}