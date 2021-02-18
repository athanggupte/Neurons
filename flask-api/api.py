import time
from flask import Flask, request

from ipyclient.connection import IPythonConnection

app = Flask(__name__)
ipyclient = IPythonConnection()


@app.route('/time')
def get_time():
    return { 'time': time.time() }

@app.route('/ipyclient/connect')
def connect_ipython():
    ipyclient.connect()
    print(ipyclient.kernel_info())
    return ipyclient.kernel_info()

@app.route('/ipyclient/result', methods=['POST'])
def get_ipython_result():
    print(request.json)
    response = ipyclient.execute_for_result(request.json['expr'])
    print(response)
    return response
