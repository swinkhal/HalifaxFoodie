import json
import gspread
import boto3
from boto3.dynamodb.conditions import Key, Attr

gc = gspread.service_account(filename='recipe_statistics.json')
gsheet = gc.open("halifaxfoodie")
sheet1 = gsheet.sheet1
sheet1.clear()

def lambda_handler(event, context):
    dynamo_db = boto3.resource('dynamodb')
    table = dynamo_db.Table('recipe_statistics')
    
    res = table.scan(FilterExpression=Attr('restaurant_id').eq("tawagrills@res.ca"))
    if res['Count'] == 0:
        return {
            'statusCode': 200,
            'body':json.dumps('No record exist')
        }
    else:
        print(res)
        # recipe_map = []
        item = res['Items']
        sheet1.insert_row(["recipe_code", "recipe_name"],index = 1)
        for i in item:
            recipe_code = i['recipe_code']
            print(recipe_code)
            recipe_name = i['recipe_name']
            print(recipe_name)
            # recipe_price = i['recipe_price']          
            # print(recipe_price)
            recipe_map = [recipe_code,recipe_name]
            sheet1.insert_row(recipe_map, index = 2)

    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    