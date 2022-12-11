import json
import gspread
import boto3
from boto3.dynamodb.conditions import Key, Attr

gc = gspread.service_account(filename='login_statistics.json')
gsheet = gc.open("login_halifax_foodie")
sheet1 = gsheet.sheet1
sheet1.clear()

def lambda_handler(event, context):
    dynamo_db = boto3.resource('dynamodb')
    table = dynamo_db.Table('login_statistics')
    
   
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
        sheet1.insert_row(["time", "user_id"],index = 1)
        for i in item:
            time = i['time']
            print(time)
            user_id = i['user_id']
            print(user_id)
            login_map = [time,user_id]
            sheet1.insert_row(login_map, index = 2)
        

        return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    
 

