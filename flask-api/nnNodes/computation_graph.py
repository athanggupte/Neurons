import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from collections import deque


print('Loading ComputationGraph')

########### CONSTANT VARIABLES ########################################

# Maps the node type names to their keras object constructors
__NODE_TYPE_DICT__ = { 
    'InputNode': keras.Input,
    #'OutputNode': keras.Model,
    'DenseNode': layers.Dense,
    'ActivationNode': layers.Activation,
    
    # TODO: Add more nodes/layers
}

#######################################################################

class ComputationGraph(object):
    """
    Contains the functions and variables for maintaining the 
    computational graph which can be dynamically modified without
    having to rollback changes to the keras model
    """   

    def __init__(self):
        # Nodes added to the workspacedata.id
        self.__nodes__ = {
            # 'node_id': {
            #       'node': <Node object>, 
            #       'out_links': [ <ids of target nodes> ],
            #       'in_links': [ <ids of source nodes> ]
            # }, ...so on...
        }

        # The computation graph state
        self.__graph__ = {
            'nodes': self.__nodes__,
        #   'edges': None,
            'start': 'input_1',
            'end': 'output_1',
            'node_count': {},
        }
        

    def addNode(self, nodeType , **kwargs):
        """
        Adds a node to the list of nodes of the computational graph
        
        Parameters
        ----------
        nodeType: str
            the type of node to add - one of __NODE_TYPE_DICT__ values
        **kwargs: 
            passed to the constructor of the node to be created
        """
        self.debugGraph()
        
        if nodeType in __NODE_TYPE_DICT__:
            if nodeType in self.__graph__['node_count']:
                self.__graph__['node_count'][nodeType] += 1
            else:
                self.__graph__['node_count'][nodeType] = 1
            
            nodeName = nodeType[:-4].lower() + '_' + str(self.__graph__['node_count'][nodeType])
            
            node = __NODE_TYPE_DICT__[nodeType](name=nodeName, **kwargs)
            self.__nodes__[node.name] = { 'node': node, 'out_links': [], 'in_links': [] }
            
            return node.name


    def updateNodeAttrs(self, nodeId, **kwargs):
        """
        Updates attributes of a node in the list of nodes of the
        computational graph
        
        Parameters
        ----------
        nodeType: str
            the type of node to add - one of __NODE_TYPE_DICT__ values
        **kwargs: 
            arguments to be changed
        """
        
        node = self.__nodes__[nodeId]['node']
        
        for key in kwargs:
            if hasattr(node, key):
                setattr(node, key, kwargs[key])


    def updateNode(self, nodeId, **kwargs):
        """
        Updates a node in the list of nodes of the computational graph
        
        Parameters
        ----------
        nodeType: str
            the type of node to add - one of __NODE_TYPE_DICT__ values
        **kwargs: 
            arguments to be changed
        """
        
        node = self.__nodes__[nodeId]['node']
        newNode = type(node)(**kwargs)
        self.__nodes__[nodeId]['node'] = newNode
        del node    
        
        
    def addEdge(self, sourceId, targetId):
        """
        Adds a directed edge between two nodes identified by their id's
        
        Parameters
        ----------
        srcNodeId: str
            id of the source node
        tgtNodeId: str
            id of the target node
        """
        
        self.__nodes__[sourceId]['out_links'].append(targetId) 
        self.__nodes__[targetId]['in_links'].append(sourceId)
        
        
    def debugGraph(self, show_types=False):
        """
        Prints a string representation of the graph for easy debugging
        """
        
        print("\n---------- DEBUG ----------")
        
        print("start:", self.__graph__['start'])
        print("end:", self.__graph__['end'])
        print("nodes:")
        
        for k, v in self.__nodes__.items():
            print("\t{}:".format(k))
            if show_types:
                print("\t\ttype:", type(v['node']))
            print("\t\tout_links:", v['out_links'])
            print("\t\tin_links:", v['in_links'])
            
        print("\n---------------------------")
        

        
    def getModel(self):
        """
        Creates a keras.Model from the computation graph
        """

        visited = set()
        children = deque()

        children.append(self.__graph__['start'])
        
        while children: #node['out_links'] != []:
            node_id = children.popleft() #children[0]
            node = self.__nodes__[node_id]
            
            if node_id not in visited:
                if all(item in visited for item in node['in_links']):
                    print('node:', node_id)
                    visited.add(node_id)
                    print('VISITED: ', visited)
                else:
                    children.append(node_id)
            
            children.extend(node['out_links'])
            print('CHILDREN:', children)
            
            print('')

