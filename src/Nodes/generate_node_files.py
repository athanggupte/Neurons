import os
import re

files = os.listdir()

files = [re.match(r'^([A-Z][a-zA-Z0-9]*Node)\.js$', file) for file in files]
files = [f.group(1) for f in files if f is not None]

with open('NeuralNodeTypes.js', 'w') as file:
    print('Found {} types:'.format(len(files)))
    for importFile in files:
        print(importFile)
        file.write('import %s, { nodeId as %sId } from \'./%s\';\n' % (importFile, importFile, importFile))
        
    file.write('\nconst neuralNodeTypes = {\n')
    for importFile in files:
        #file.write('\t[%sId]: %s,\n' % (importFile, importFile))
        file.write('\t%s: %s,\n' % (importFile, importFile))
    file.write('};\n')
    file.write('\nexport default neuralNodeTypes;')
