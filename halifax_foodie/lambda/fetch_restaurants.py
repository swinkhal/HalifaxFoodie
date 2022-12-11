import json
import boto3
# import re
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
        table = dynamo_db.Table('user')
    
        restaurants = []
        
        # body = event['body']
        # body_json = json.loads(body)
        # restaurant_id = body_json['restaurantId']
        

        res = table.scan(FilterExpression=Attr('role').eq("owner"))
        logger.info(res)
        if res['Count'] == 0:
            response = create_response(True,"No Restaurant registered.", None)
        else:
            logger.info(res)
            for i in range(res['Count']):
                dictionary = {}
    
                restaurant_name = res['Items'][i]['name']
                restaurant_id = res['Items'][i]['email']
                restaurant_contact = res['Items'][i]['contactNumber']
                restaurant_address = res['Items'][i]['address']
                
                dictionary['restaurantName'] = restaurant_name
                dictionary['restaurantId'] = restaurant_id
                dictionary['restaurantContact'] = restaurant_contact
                dictionary['restaurantAddress'] = restaurant_address
                
                restaurants.append(dictionary)
          
            response = create_response(True, "Restaurants found successfully", restaurants)

    except Exception as e:
        response = create_response(False, str(e), None)
        raise e
        
    return response