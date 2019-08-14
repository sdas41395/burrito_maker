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

'''
                                                        Burrito Maker Backend
    This file describes in entirety the backend of the application which deals with database interactions. 
    The server utilizes a mongodbconnection that has been whitelisted for all users
    Note that the email as well as the mongo connection relies on a config.py file located in the same directory
    In production I would utilize more environment variables but given this time limit, figured it for the best for now




'''

# ----------------------------- Helper Functions -------------------------
'''
    These funcitons describe either connecting to the smtp email server or mongo server, and the mongodb interactions
    Each function has three returns:
        Boolean value : describes end result of the helper function
        Data Struct : usually describes the modified data object or retrieved data object.
        msg : the error message or success message to aid in debugging

'''

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
        url = configObject['mongo_url']
        client = MongoClient(url)
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
    Parameters:
        collection : database object
        burrito_order : ingredients object selecte by user
                      : {
                          email : xxxx@gmail.com,
                          order : {
                              'meat' : ['steak', 'pork'],
                              'veggie' : ['corn' , 'avocado'],
                              'rice' : [],
                              'sauce' : []
                          }
                        }
    Returns:
        Boolean Flag
        Inserted Object
        Flag Message
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
            'status' : [{'0':'Ordered!'}]
        }

        cursor = collection.insert_one(insertion_dict)
        insertion_id = json.loads(json_util.dumps(cursor.inserted_id))["$oid"]
        return True, insertion_id, 'successful insertion'

    except Exception as e:
        return False, '', e


def update_order_mongo(collection, _id, status):
    '''
    Updates an order based on passed in _id with status
    Parameters:
        collection : database object
        _id : ticket of the order
        status : status to be appended to the status array
    Returns:
        Boolean Flag
        Updated Object
        Flag Message
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
                cursor_user['status'].append(status)

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
    Parameters:
        collection : database object
    Returns:
        Boolean Flag
        All previous tickets in the database
        Flag Message
    '''
    order_array = []
    try:
        cursor = collection.find({})
        for document in cursor:
            order_array.append(json.loads(json_util.dumps(document)))
        return True, order_array, "successful return of all documents"

    except Exception as e:
        return False, order_array, e

def return_single_order(collection, order_id):
    '''
    Returns single order based on order id
    Parameters:
        collection : database object
        order_id : order ticket to retrieve data from
    Returns:
        Boolean Flag
        Single ticket data
        Flag Message
    '''
    cursor_user = {}
    try:
        cursor_user = collection.find_one({"_id" : ObjectId(order_id)})

        if cursor_user == None:
            return False, {}, 'unable to find order id'
        else:
            print cursor_user
            return True, json.loads(json_util.dumps(cursor_user)), 'successful return of cursor object'

    except Exception as e:
        return False, cursor_user, e

def update_tip_amount(collection, tip):
    '''
    Updates the tip field in the database by the passed in tip
    Parameters:
        collection : database object
        tip : tip amount given by user
    
    Returns:
        Boolean Flag
        The tip data struct
        Flag Message
    '''
    cursor_management = {}
    try:
        cursor_management = collection.find({})

        if cursor_management == None:
            return False, {}, 'unable to find order id'
        else:
            tip_db = cursor_management[0]
            id_object = tip_db['_id']
            tip_amount = int(tip_db['tip']) + int(tip)
            cursor = collection.update_one({'_id' : ObjectId(id_object)}, {"$set" : {'tip' : str(tip_amount)}}, upsert = True)

            return True, json.loads(json_util.dumps(cursor_management)), 'successful return of cursor object'

    except Exception as e:
        return False, cursor_management, e






# ----------------------------- Routing -------------------------
'''
    This section of server code describes the REST guidelines for interacting with the server

    All of the routes follow the same strategy:
    1) Attempt a database connection to the associated collection
    2) Run helper database helper function
    3) Check flags for confirmation before returning response dictionary

'''
@app.route('/mongo/add_tip', methods=['POST'])
def add_tip_route():
    '''
    Adds a tip to the stored database of tips
    '''
    response = {}
    bool_return = False
    order_data = {}
    msg = ''

    try:
        db,collection = mongo_db_connection('mission_burrito_delivery', 'mission_management')
    except:
        response['status'] = 500
        response['message'] = 'Unable to connect to mongo database'
        return jsonify(response)

    user_data = request.data
    dataDict = json.loads(user_data)
    tip = dataDict['tip']

    bool_return, tip_data, msg = update_tip_amount(collection, tip)
    
    if bool_return == True:
        response['status'] = 200
    else:
        response['status'] = 500

    response['message'] = msg
    response['data'] = tip_data

    return jsonify(response)
    

@app.route('/mongo/check_order', methods=['GET'])
def check_order_route():
    '''
    Checks a single document's order in the database and returns its data
    '''
    response = {}
    bool_return = False
    order_data = {}
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

    print order_id

    bool_return, order_data, msg = return_single_order(collection, order_id)
    
    if bool_return == True:
        response['status'] = 200
    else:
        response['status'] = 500

    response['message'] = msg
    response['data'] = order_data
    return jsonify(response)
    

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