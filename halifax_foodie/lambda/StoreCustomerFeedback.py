import json
import boto3
import pprint
import re
import random
import logging
from boto3.dynamodb.conditions import Key, Attr
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def create_response(status, message, data):
    return {
        "status": status,
        "message": message,
        "data": data
    }

def lambda_handler(event, context):
    try:
        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
        dynamo_db = boto3.resource('dynamodb')
        table = dynamo_db.Table('feedback')
        
        r1 = random.randint(10, 100000)
        
        body = event['body']
        body_json = json.loads(body)
        user_id = body_json['userId']
        restaurant_id = body_json['restaurantId']
        feedback = body_json['feedback']
        id = str(r1)
        
        res = table.put_item(
                Item={
                  'id': id,    
                  'feedback' :feedback,
                  'restaurant_id':restaurant_id,
                  'user_id' : user_id
                })
        response = create_response(True,"Inserted Successfully", None)
        
            
    except Exception as e:
        response = create_response(False, str(e), None)
        raise e
        
    return response