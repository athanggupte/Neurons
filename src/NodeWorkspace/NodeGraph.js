import ReactFlow, 
{
    Background,
    MiniMap,
    Controls,
    useStoreState,
    addEdge 
} from 'react-flow-renderer';

import { useState, useEffect } from 'react';
import neuralNodeTypes from './../Nodes/NeuralNodeTypes';
import NodeMenu from './NodeMenu';
import NodeMenuItems from './NodeMenuItems';

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
    
    
    const [menuOpts, setMenuOpts] = useState({ show: false, xpos: 100, ypos: 100 });
    
    const onContextmenu = (event) => {
        event.preventDefault();
        const xPos = event.pageX;
        const yPos = event.pageY;
        
        // if event.target == ... <- select different menuItems for different elements
        
        return setMenuOpts({
            show: true,
            xpos: xPos,
            ypos: yPos,
            menuItems: NodeMenuItems,
        });
    };
    
    const onClick = (event) => {
        return setMenuOpts({
            show: false,
        });
    };
    
    return (
        <div style={{ height: '100%' }}
            id='workspace'
            onContextMenu={onContextmenu}
            onClick={onClick}
        >
            <ReactFlow
                elements={elements}
                nodeTypes={neuralNodeTypes}
                onConnect={onConnect}
            >
                <Background />
                <Controls />
                <MiniMap />
                { menuOpts.show ? 
                    (<NodeMenu 
                        xpos={menuOpts.xpos}
                        ypos={menuOpts.ypos}
                        menuItems={menuOpts.menuItems}
                    />)
                    : (<></>)
                }
            </ReactFlow>
            <button onClick={addNode} style={{ zIndex: 10, position: 'absolute', top: 100, right: 25 }}>AddNode</button>
        </div>
    );
};
