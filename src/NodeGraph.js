import ReactFlow, 
{
    Background,
    MiniMap,
    Controls,
    useStoreState,
    addEdge 
} from 'react-flow-renderer';

import { useState, useEffect } from 'react';
import neuralNodeTypes from './Nodes/NeuralNodeTypes';

export default (props) => {
    
    const [elements, setElements] = useState([
        {
            id: '1',
            type: 'InputNode',
            position: { x: 100, y: 100 },
            data: { label: 'Input Neuron' },
        },
    ]);

//     useEffect(() => {
//         }, 
//         [elements]
//     );
    
    const addNode = () => {
        const newNode = {
            id: '2',
            type: 'default',
            position: { x: 600, y: 300 },
            data: { label: 'New Node' },
            targetPosition: 'left',
            sourcePosition: 'right',
        };
        setElements((els) => els.concat(newNode));
    };
    
    const onConnect = (params) => setElements((els) => {
        params.arrowHeadType = 'arrow';
        params.type = 'smoothstep';
        //params.animated = true;
        return addEdge(params, els);
    });
    
    return (
        <div style={{ height: window.innerHeight }}>
            <ReactFlow
                elements={elements}
                nodeTypes={neuralNodeTypes}
                onConnect={onConnect}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
            <button onClick={addNode} style={{ zIndex: 10, position: 'absolute', top: 100, right: 25 }}>AddNode</button>
        </div>
    );
};
