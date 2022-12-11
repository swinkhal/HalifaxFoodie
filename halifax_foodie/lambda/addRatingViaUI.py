import json
import boto3
import random
import re
def lambda_handler(event, context):
    if (event):
        #print(event)
        generateId = random.randint(10, 100000)
        #https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
        getTable = boto3.resource('dynamodb')
        data= event
        print(event)
        feedback = data['ratings']
        username=data['username']

        #https://dynobase.dev/dynamodb-python-with-boto3/#scan
        getRating = getTable.Table("rating")
        if(len(feedback)!=0):
          #https://binaryguy.tech/aws/dynamodb/put-items-into-dynamodb-table-using-python/
             response = getRating.put_item(
                Item={
                  'id':str(generateId),    
                  'userName' :username,
                  'feedback':feedback,
                })
       
        return {
            'statusCode': 200,
            # 'headers': {
            #             'Access-Control-Allow-Headers': 'Content-Type',
            #             'Access-Control-Allow-Origin': '*',
            #             'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            #             },
            'body': json.dumps('Hello from Lambda!')
        }
