import json
import boto3
import math

dynamodb = boto3.resource('dynamodb')

#https://www.chegg.com/homework-help/questions-and-answers/python-code-columnar-transposition-cipher-want-understand-every-line--possible-explain-sim-q74190250
def createCipherText(key, plainText):
    cipherText = ""
    j = 0
    lpt = float(len(plainText))
    listPlainTxt = list(plainText)
    ltKey = sorted(list(key))
    c = len(key)    
    row = int(math.ceil(lpt / c))

    nullVal = int((row * c) - lpt)
    listPlainTxt.extend('_' * nullVal)
    genMatrix = [listPlainTxt[i: i + c]
            for i in range(0, len(listPlainTxt), c)]
    for _ in range(c):
        k = key.index(ltKey[j])
        cipherText += ''.join([row[k]
                        for row in genMatrix])
        j += 1
    return cipherText

def lambda_handler(event, context):
    userTable = dynamodb.Table('user')
    cipherText = createCipherText(data['key'],data['plainText'])
    #https://binaryguy.tech/aws/dynamodb/put-items-into-dynamodb-table-using-python/
    userTable.put_item(Item=
    {
        'user_id': data['userName'],
        'userName': data['userName'],
        'userEmail': data['email'],
        'userRole': data['role'],
        'userkey': data['key'],
        'plainText': data['plainText'],
        'cipherText': cipherText
        
    })
    return {
        'statusCode': 200,
        'body':cipherText,
        # 'message' : message
    }