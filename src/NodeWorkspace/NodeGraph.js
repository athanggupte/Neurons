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
            data: null,
        },
    ]);
    const [elementArgs, setElementArgs] = useState({});

//     useEffect(() => {
//         }, 
//         [elements]
//     );
    
    useEffect(() => { console.log(elementArgs); }, [elementArgs]);
    
    const addNode = useCallback((type, position, data) => {
        const id = (elements.length+1);
        data.onArgsChange = (newArgs) => {
            const elArgs = {...elementArgs};
            elArgs[id] = newArgs;
            setElementArgs(elArgs);
        };
        
        const newNode = {
            id: id.toString(),
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
                    action: () => { addNode(type, position, {}); },
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
    
    const onClick = (event) => setMenuOpts({ show: false, });
    
    const getNodeTypes = (neuralNodeTypes) => {
        let nodesDict = {};
        for (let [category, categoryNodes] of Object.entries(neuralNodeTypes)) {
            nodesDict = Object.assign({}, nodesDict, categoryNodes);
        }
        return nodesDict;
    };
    
    const getState = () => {
        const state = [...elements];
        for (let [nodeId, args] of Object.entries(elementArgs)) {
            state[nodeId-1].args = args;
            console.log(nodeId, args);
        }
        return state;
    }
    
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
                <button style={{ zIndex: 10, position: 'absolute', top: 100, right: 50 }} onClick={() => {console.log(getState())}}>Get graph state</button>
            </ReactFlow>
        </div>
    );
};
