import boto3
import json
import random
import re

def lambda_handler(event, context):
    if (event):
        print(event)
        #https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
        genarateId = random.randint(10, 100000)
        getTable = boto3.resource('dynamodb')
        # data= event
        review= event['currentIntent']['slots']['rating']
        username=event['currentIntent']['slots']['user_id']
       
        getRating = getTable.Table("rating")
        if(len(review)!=0):
          #https://binaryguy.tech/aws/dynamodb/put-items-into-dynamodb-table-using-python/
             response = getRating.put_item(
                Item={
                  'id':str(genarateId),    
                  'userName' :username,
                  'rating':review
                })
       
       #https://docs.aws.amazon.com/lex/latest/dg/what-is.html
        return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled","message": { "contentType": "PlainText", "content": "Rating has been added. Thanks!."}}}
       