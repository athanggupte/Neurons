import time
from flask import Flask, request

from ipyclient.connection import IPythonConnection
from nnNodes.computation_graph import ComputationGraph

app = Flask(__name__)
#ipyclient = IPythonConnection()
cg = ComputationGraph()


@app.route('/time')
def get_time():
    return { 'time': time.time() }

@app.route('/ipyclient/connect')
def connect_ipython():
    ipyclient.connect()
    print(ipyclient.kernel_info())
    response = ipyclient.execute_for_result('from ipyclient.nn import computation_graph as cg')
    print(response)
    return ipyclient.kernel_info()

@app.route('/ipyclient/result', methods=['POST'])
def get_ipython_result():
    print(request.json)
    response = ipyclient.execute_for_result(request.json['expr'])
    print(response)
    return response

@app.route('/nn/reset')
def nn_reset():
    global cg
    if cg:
        del cg
        cg = None
    cg = ComputationGraph()
    print(cg.debugGraph())
    return {}

@app.route('/nn/addnode', methods=['POST'])
def nn_add_node():
    print(request.json)
    nodeId = cg.addNode(request.json['type'], **request.json['args'])
    cg.debugGraph()
    #print(response)
    return { 'id': nodeId }
    
@app.route('/nn/addedge', methods=['POST'])
def nn_add_edge():
    print(request.json)
    cg.addEdge(**request.json['edgeNodes'])
    cg.debugGraph()
    return {}

    
@app.route('/nn/updatenode', methods=['POST'])
def nn_update_node():
    print(request.json)
    return {}

@app.route('/nn/updateattrs', methods=['POST'])
def nn_update_attrs():
    print(request.json)
    return {}
