import ReactFlow, {
    Background,
    MiniMap,
    Controls,
    useStoreState,
    addEdge,
} from 'react-flow-renderer';

import { useState, useEffect, useCallback } from 'react';
import neuralNodeTypes from './../Nodes/NeuralNodeTypes';
import NodeMenu from './NodeMenu';
//import NodeMenuItems from './NodeMenuItems';
import './workspace.css';

export default (props) => {
    
    const [elements, setElements] = useState([
        {
            id: '1',
            type: 'InputNode',
            position: { x: 100, y: 100 },
            data: { label: 'Input Node' },
        },
    ]);

//     useEffect(() => {
//         }, 
//         [elements]
//     );
    
    const addNode = useCallback((type, position, data) => {
        const newNode = {
            id: (elements.length+1).toString(), //nextId.toString(),
            type: type,
            position: position,
            data: data,
        };
        setElements((els) => els.concat(newNode));
    }, [elements]);
    
    const onConnect = (params) => setElements((els) => {
        params.arrowHeadType = 'arrow';
        params.type = 'smoothstep';
        //params.animated = true;
        return addEdge(params, els);
    });
    
    
    const [menuOpts, setMenuOpts] = useState({ show: false, xpos: 100, ypos: 100 });
    
    const nodeMenuItems = useCallback((position) => {
        let categoryList = [];
        for (let [category, categoryNodes] of Object.entries(neuralNodeTypes)) {
            let nodeList = [];
            for (let [type, value] of Object.entries(categoryNodes)) {
                nodeList = nodeList.concat({
                    title: type,
                    submenu: null,
                    action: () => { addNode(type, position, null); },
                });
            }
            categoryList = categoryList.concat({
                title: category,
                submenu: nodeList,
            });
        }
        
        return ({
            menu: [
                {
                    title: 'Clear',
                    submenu: null,
                },
                {
                    title: 'Add node',
                    submenu: categoryList,
                }
            ]
        });
    }, [neuralNodeTypes, elements]);
    
    const onContextmenu = (event) => {
        event.preventDefault();
        const xPos = event.pageX;
        const yPos = event.pageY;
        
        console.log('target class:', event.target.className);
        
        // if event.target == ... <- select different menuItems for different elements
        
        return setMenuOpts({
            show: true,
            xpos: xPos,
            ypos: yPos,
            menuItems: nodeMenuItems({ x: xPos, y: yPos }),
        });
    };
    
    const onClick = (event) => {
        return setMenuOpts({
            show: false,
        });
    };
    
    const getNodeTypes = (neuralNodeTypes) => {
        let nodesDict = {};
        for (let [category, categoryNodes] of Object.entries(neuralNodeTypes)) {
            nodesDict = Object.assign({}, nodesDict, categoryNodes);
        }
        return nodesDict;
    };
    
    return (
        <div style={{ height: '100%' }}
            id='workspace'
            onContextMenu={onContextmenu}
            onClick={onClick}
        >
            <ReactFlow
                elements={elements}
                nodeTypes={getNodeTypes(neuralNodeTypes)}
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
        </div>
    );
};
