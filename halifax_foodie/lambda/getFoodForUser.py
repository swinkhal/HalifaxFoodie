import boto3
import json
import re
from difflib import SequenceMatcher
from boto3.dynamodb.conditions import Attr
#https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
#https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.htm
def lambda_handler(event, context):
    if (event):
        db = boto3.resource('dynamodb')
        foodTable = db.Table("recipe")
        foodDataList = []
        idlist = []
        food = foodTable.scan()
        
        foodData = food['Items']
        for fooditem in foodData:
            fid = fooditem['id']
            fprice=fooditem['price']
            FoodData = {
                "foodName": fooditem['recipe_name'],
                "foodId":str(fid),
                "price":str(fprice),
                "ingredient":fooditem['recipe_desc']
            }
            foodDataList.append(FoodData)
            
        response = [{'food':foodDataList}]
        print(response)
        return {
            'statusCode':200 ,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
            'body':json.dumps(response)
            }