from flask import request
from flask import Flask
from flask_cors import CORS
from flask import jsonify
import requests
import json
from flask import render_template
from config import configObject
import datetime
from pymongo import MongoClient
from bson import json_util, ObjectId
import smtplib


app = Flask(__name__)

# ----------------------------- Helper Functions -------------------------

def mongo_db_connection(db_name, collection):
    '''
    Connects to sql database
    Parameters:
        db_name : database name
        collection : collection name
    
    Return:
        db : db access object
        collection : collection access object

    '''
    try:
        client = MongoClient("mongodb://admin:picnichealth@cluster0-shard-00-00-hzhjd.mongodb.net:27017,cluster0-shard-00-01-hzhjd.mongodb.net:27017,cluster0-shard-00-02-hzhjd.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true")
        db = client[db_name]
        collection = db[collection]

        return db, collection
            
    except Exception as e:
        print ("Unable to connect to clinical trials database")
        print (e)
        return 


def gmail_connection(receiver, burrito_order):
    '''
    Connect to gmail account to send out hashed trial information
    Parameters:
        receiver : email account passed by user
        burrito_order : the dictionary object of burrito options picked
    Return:
        1st arg : boolean value
        2nd arg : String error value
    '''
    try:

        print 'SENDING EMAIL TO '
        print receiver

        if '@' not in receiver:
            return False,"Error in email address"
        else:
            receiver_email = receiver 

        gmail_user = configObject['gmail_username']
        gmail_password = configObject['gmail_password']

        sent_from = gmail_user
        to = [receiver, 'sdas41395@gmail.com']
        subject = 'Message from Polaris'
        body = 'Your burrito order is here! Thank you for using Mission Burrito and we hope you enjoy our world famous Digital Burritos!'
        body_2 = '--- Receipt ---'
        body_3 = str(burrito_order)

        email_body = body + '\n' + body_2 + '\n' + body_3 + '\n'
        email_text = """\
        From: %s
        To: %s
        Subject: %s

        %s
        """ % (sent_from, ", ".join(to), subject, email_body)

        try:
            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            server.ehlo()
            server.login(gmail_user, gmail_password)
            server.sendmail(sent_from, to, email_text)
            server.close()

            return True, 'Email sent!'

        except Exception as e:
            print 'Something went wrong...'
            return False, e


    except Exception as e:
        print e
        print "Error in trying to send admin email"


def add_order_mongo(collection, burrito_order):
    '''
    Adds the burrito order to the mongodb
    '''
    try:
        currentDT = datetime.datetime.now()
        username = burrito_order['email']
        order = burrito_order['order']

        insertion_dict = {
            'datetime' : str(currentDT),
            'username' : username,
            'order' : order,
            'delivered' : '',
            'rating' : '',
            'status' : ['Ordered!']
        }

        cursor = collection.insert_one(insertion_dict)
        insertion_id = json.loads(json_util.dumps(cursor.inserted_id))["$oid"]
        return True, insertion_id, 'successful insertion'

    except Exception as e:
        return False, '', e


def update_order_mongo(collection, _id, status):
    '''
    Update the user's burrito order status in mongodb
    '''
    user_document = {}
    try:
        cursor_user = collection.find_one({"_id" : ObjectId(_id)})
        if cursor_user == None:
            return False, user_document, 'unable to find order id'

        user_status = cursor_user['status']
        if status in user_status:
            return False, json.loads(json_util.dumps(cursor_user)), 'status already inserted'
        else:
            if status != 'Delivered!':
                cursor = collection.update_one({'_id' : ObjectId(_id)}, {"$push" : {'status' : status}}, upsert = True)
            else:
                deliveredDT = str(datetime.datetime.now())
                cursor_user['delivered'] = deliveredDT
                cursor_user['status'].append('Delivered!')
                cursor = collection.update_one({'_id' : ObjectId(_id)}, {"$push" : {'status' : status}}, upsert = True)
                cursor = collection.update_one({'_id' : ObjectId(_id)}, {"$set" : {'delivered' : deliveredDT}}, upsert = True)

            return True, json.loads(json_util.dumps(cursor_user)), "successful entry of status"


    except Exception as e:
        return False, {}, e

def return_past_orders(collection):
    '''
    Returns all past orders 
    '''
    order_array = []
    try:
        cursor = collection.find({})
        for document in cursor:
            print document
            order_array.append(json.loads(json_util.dumps(document)))
        return True, order_array, "successful return of all documents"

    except Exception as e:
        return False, order_array, e

def return_single_order(collection, order_id):
    '''
    Returns single order based on order id
    '''
    order_array = []
    try:
        cursor = collection.find({})
        for document in cursor:
            print document
            order_array.append(json.loads(json_util.dumps(document)))
        return True, order_array, "successful return of all documents"

    except Exception as e:
        return False, order_array, e

# ----------------------------- Routing -------------------------

@app.route('/mongo/return_all', methods=['GET'])
def return_all_route():
    '''
    Returns all documents inside burrito orders database
    '''
    response = {}
    bool_return = False
    total_orders = []
    msg = ''

    try:
        db,collection = mongo_db_connection('mission_burrito_delivery', 'burrito_orders')
    except:
        response['status'] = 500
        response['message'] = 'Unable to connect to mongo database'
        return jsonify(response)

    bool_return, total_orders, msg = return_past_orders(collection)
    
    if bool_return == True:
        response['status'] = 200
    else:
        response['status'] = 500

    response['message'] = msg
    response['data'] = total_orders
    return jsonify(response)
    

@app.route('/mongo/add_order', methods=['POST'])
def add_order_route():
    '''
    Add burrito order to mongo database
    '''
    response = {}
    bool_return = False
    msg = ''
    insertion_id = ''

    try:
        db,collection = mongo_db_connection('mission_burrito_delivery', 'burrito_orders')
    except:
        response['status'] = 500
        response['message'] = 'Unable to connect to mongo database'
        return jsonify(response)

    user_data = request.data
    dataDict = json.loads(user_data)
    burrito_order = dataDict['burrito_order']

    bool_return, insertion_id, msg = add_order_mongo(collection, burrito_order)

    if bool_return == True:
        response['status'] = 200
    else:
        response['status'] = 500
    response['msg'] = msg
    response['data'] = {'receipt_id' : insertion_id}

    return jsonify(response)


@app.route('/mongo/update_order' , methods=['POST'])
def update_order_route():
    '''
    Updates the user's order
    '''
    response = {}
    bool_return = False
    msg = ''

    try:
        db,collection = mongo_db_connection('mission_burrito_delivery', 'burrito_orders')
    except:
        response['status'] = 500
        response['message'] = 'Unable to connect to mongo database'
        return jsonify(response)

    user_data = request.data
    dataDict = json.loads(user_data)
    order_id = dataDict['_id']
    status = dataDict['status']

    bool_return, user_document, msg = update_order_mongo(collection, order_id, status)
    
    if bool_return == True:
        response['status'] = 200
    else:
        response['status'] = 500
    response['msg'] = msg
    response['data'] = user_document

    return jsonify(response)

@app.route('/mongo/deliver_order' , methods=['POST'])
def deliver_order_route():
    '''
    Updates the user's order
    '''
    response = {}
    bool_return = False
    msg = ''

    try:
        db,collection = mongo_db_connection('mission_burrito_delivery', 'burrito_orders')
    except:
        response['status'] = 500
        response['message'] = 'Unable to connect to mongo database'
        return jsonify(response)

    user_data = request.data
    dataDict = json.loads(user_data)
    order_id = dataDict['_id']
    status = 'Delivered!'

    bool_return, user_document, msg = update_order_mongo(collection, order_id, status)
    
    if bool_return == True:
        bool_email, msg_email = gmail_connection(user_document['username'], user_document)

        if bool_email == True:
            response['status'] = 200
            response['msg'] = "delivered order to " + user_document['username']
        else:
            response['status'] = 500
            response['msg'] = msg_email

    else:
        response['status'] = 500
        response['msg'] = msg

    response['data'] = user_document

    return jsonify(response)


if __name__ == '__main__':
    CORS(app)
    print("FLASK STARTING")
    app.run(host = '0.0.0.0', port=5000, debug=True)