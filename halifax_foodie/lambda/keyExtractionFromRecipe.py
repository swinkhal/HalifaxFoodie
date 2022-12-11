import json
import boto3
import pprint
import re
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

        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html
        s3 = boto3.client("s3")

        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
        dynamo_db = boto3.resource('dynamodb')
        table = dynamo_db.Table('recipe_key_ingredients')
        
        body = event['body']
        body_json = json.loads(body)
        file = body_json['filename']
        restaurant_id = body_json['restaurantId']
        bucket = "csci5410g5"
        key = restaurant_id + "/" + file + ".txt"
        json_data = [{"name": "Priyal", 
                  "message": "Hello"}]
        
        res = table.scan(FilterExpression=Attr('recipe_name').eq(file) & Attr('restaurant_id').eq(restaurant_id))
        if res['Count'] == 1:
            response = create_response(True,"Already extracted", None)
        else:
            file1 = s3.get_object(Bucket = bucket, Key = key)
            paragraph = str(file1['Body'].read())
            comprehend = boto3.client("comprehend")
            response = comprehend.detect_key_phrases(Text = paragraph, LanguageCode = "en")
            ingredients = []
            for text in response['KeyPhrases']:
                list = re.findall(r'\b[A-Z]+(?:\s+[A-Z]+)*\b', text['Text'])
                if len(list) != 0:
                    for items in list:
                        logger.info(list)
                        ingredients.append(items)
            response = table.put_item( Item = { 'recipe_name': file, 'ingredients': ingredients, 'restaurant_id': restaurant_id} )
            response = create_response(True,"Extracted successfully", None)
            
    except Exception as e:
        response = create_response(False, str(e), None)
        raise e
        
    return response