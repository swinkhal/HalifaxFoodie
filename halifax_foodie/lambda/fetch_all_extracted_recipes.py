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
        table = dynamo_db.Table('recipeKeyIngredients')
    
        extracted_recipes = []

        res = table.scan()
        logger.info(res)
        if res['Count'] == 0:
            response = create_response(True,"No recipe present.", None)
        else:
            logger.info(res)
            for i in range(res['Count']):
                dictionary = {}
    
                recipe_name = res['Items'][i]['recipe_name']
                recipe_ingredients = res['Items'][i]['ingredients']
                res_id = res['Items'][i]['restaurant_id']
                
                dictionary['RecipeName'] = recipe_name
                dictionary['RecipeIngredients'] = recipe_ingredients
                dictionary['ResId'] = res_id
                
                extracted_recipes.append(dictionary)
          
            response = create_response(True, "Recipes found successfully", extracted_recipes)

    except Exception as e:
        response = create_response(False, str(e), None)
        raise e
        
    return response