import psycopg2
from flask import request
from flask import Flask
from flask_cors import CORS
from flask import jsonify
import requests
import json
from flask import render_template



app = Flask(__name__)




@app.route('/work', methods=['GET'])
def work_pls():
    print 'hello'




if __name__ == '__main__':
    CORS(app)
    print("FLASK STARTING")
    app.run(host = '0.0.0.0', port=5000, debug=True)