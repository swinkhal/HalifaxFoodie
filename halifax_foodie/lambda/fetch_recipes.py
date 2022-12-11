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
        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
        dynamo_db = boto3.resource('dynamodb')
        table = dynamo_db.Table('recipe')
    
        restaurant_recipes = []
        
        body = event['body']
        body_json = json.loads(body)
        restaurant_id = body_json['restaurantId']
        
        logger.info(restaurant_id)

        res = table.scan(FilterExpression=Attr('restaurant_id').eq(restaurant_id))
        logger.info(res)
        if res['Count'] == 0:
            response = create_response(True,"No recipe present.", None)
        else:
            logger.info(res)
            for i in range(res['Count']):
                dictionary = {}
    
                recipe_name = res['Items'][i]['recipe_name']
                recipe_id = res['Items'][i]['id']
                recipe_price = res['Items'][i]['price']
                recipe_description = res['Items'][i]['recipe_desc']
                
                dictionary['RecipeID'] = recipe_id
                dictionary['RecipeName'] = recipe_name
                dictionary['RecipePrice'] = recipe_price
                dictionary['RecipeDescription'] = recipe_description
                
                restaurant_recipes.append(dictionary)
          
            response = create_response(True, "Recipes found successfully", restaurant_recipes)

    except Exception as e:
        response = create_response(False, str(e), None)
        raise e
        
    return response