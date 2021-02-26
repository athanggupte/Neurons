from computation_graph import ComputationGraph
from pprint import PrettyPrinter

#import tracemalloc

#tracemalloc.start()

pprint = PrettyPrinter(indent=4).pprint

cg = ComputationGraph()

print(cg.addNode('InputNode', shape=(32,1)))

def addDenseNode(units):
    print(cg.addNode('DenseNode', units=units))

addDenseNode(64)
addDenseNode(16)
addDenseNode(8)
addDenseNode(1)

#print(cg.addNode('DenseNode', units=16))
#print(cg.addNode('DenseNode', units=8))
#print(cg.addNode('DenseNode', units=1))

#pprint(cg.__graph__)
#pprint(cg.__nodes__['dense'].get_config())

#print(tracemalloc.get_traced_memory())

#cg.updateNode('dense', units=32)
#pprint(cg.__graph__)
#pprint(cg.__nodes__['dense'].get_config())

#print(tracemalloc.get_traced_memory())

cg.addEdge('input_1', 'dense_1')
cg.addEdge('dense_1', 'dense_2')
cg.addEdge('dense_2', 'dense_3')
cg.addEdge('dense_3', 'dense_4')
cg.addEdge('dense_1', 'dense_4')

cg.debugGraph()


print('\nComputation graph:\n-----------------')

cg.getModel()
