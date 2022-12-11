import json
import boto3
import math
from boto3.dynamodb.conditions import Attr

#https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.htm
db = boto3.resource('dynamodb')                  

#https://www.chegg.com/homework-help/questions-and-answers/python-code-columnar-transposition-cipher-want-understand-every-line--possible-explain-sim-q74190250
def cipherDecrypt(cipher,key):
    pText = ""
    i = 0
    ipt = 0
    lengthPlaintTxt = float(len(cipher))
    lpt = list(cipher)
    c = len(key)    
    row = int(math.ceil(lengthPlaintTxt / c))
    listOfKey = sorted(list(key))
    cipherDec = []


    for _ in range(row):
        cipherDec += [[None] * c]

    for _ in range(c):
        currentIndex = key.index(listOfKey[i])
        for j in range(row):
            cipherDec[j][currentIndex] = lpt[ipt]
            ipt += 1
        i += 1

    try:
        pText = ''.join(sum(cipherDec, []))
    except TypeError:
        raise TypeError("No same words allowed!")
    
    nullVal = pText.count('_')
    if nullVal > 0:
        return pText[: -nullVal]
    
    return pText
    
    
def lambda_handler(event, context):
    body=event
    username = body['username']
    cipher =  body['cipher']
   #https://highlandsolutions.com/resources/blog/hands-on-examples-for-working-with-dynamodb-boto3-and-python
    uTable = db.Table('user')
    text = ""
    data =  uTable.scan(
        FilterExpression=Attr('user_id').eq(username)
        )
    userData = data['Items']

    for i in userData:
        if i['user_id']== username:
            generatedPlainText = cipherDecrypt(i['plainText'],i['userkey'])
            if i['plainText'] == generatedPlainText:
                text = 'User has been verified!'
            else:
                text = 'User not a verified one'
    return {
        'statusCode':200 ,
        'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
        'body':json.dumps([{'text':text}])
    }