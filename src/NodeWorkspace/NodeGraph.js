import ReactFlow, {
    ReactFlowProvider,
    Background,
    MiniMap,
    Controls,
    useStoreState,
    addEdge,
    useZoomPanHelper,
} from 'react-flow-renderer';

// import { useZoomPanHelper } from 'react-flow';

import { useState, useEffect, useCallback } from 'react';
import neuralNodeTypes, { nodeArgs } from './../Nodes/NeuralNodeTypes';
import NodeMenu from './NodeMenu';
//import NodeMenuItems from './NodeMenuItems';
import './workspace.css';

export default (props) => {
//     const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const { project } = useZoomPanHelper();
    
    const [elements, setElements] = useState([]);
    const [elementArgs, setElementArgs] = useState({});
    const [elemIndex, setElemIndex] = useState({});
    
//     useEffect(() => {
//         }, 
//         [elements]
//     );
    
//     useEffect(() => { console.log('reactFlowInstance:', reactFlowInstance); }, [reactFlowInstance]);
//     useEffect(() => { console.log('elementArgs:', elementArgs); }, [elementArgs]);
    
    const addNodeToElements = useCallback((id, type, position, data) => {
        data.onArgsChange = (newArgs) => {
            const elArgs = {...elementArgs};
            elArgs[id] = newArgs;
            setElementArgs(elArgs);
            console.log(newArgs);
        };
        
//         console.log('reactFlowInstance:', reactFlowInstance);
        
        const newNode = {
            id: id.toString(),
            type: type,
            //position: reactFlowInstance.project(position),
            position: project(position),
            data: data,
        };
        
        let eIdx = {...elemIndex};
        eIdx[id] = elements.length;
        setElemIndex(eIdx);
        
        setElements((els) => els.concat(newNode));
    }, [elements, /*reactFlowInstance*/]);
    
    
    const addNode = useCallback((type, position, data) => {
        fetch('/nn/addnode', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                type: type,
                args: nodeArgs[type],
            }),
        }).then(res => res.json()).then(data => {
            addNodeToElements(data.id, type, position, data);
        });
    }, [addNodeToElements, /*reactFlowInstance*/]);
    
    
    const onConnect = (params) => {
        fetch('/nn/addedge', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                edgeNodes: {
                    sourceId: params.source,
                    targetId: params.target,
                }
            }),
        }).then(() => {
        
//             console.log(params);
            
            setElements((els) => {
                params.arrowHeadType = 'arrow';
                params.type = 'smoothstep';
                
                //params.animated = true;
                return addEdge(params, els);
            });
        });
    };
    
    
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
    
    const getNodeTypes = useCallback((neuralNodeTypes) => {
        let nodesDict = {};
        for (let [category, categoryNodes] of Object.entries(neuralNodeTypes)) {
            nodesDict = Object.assign({}, nodesDict, categoryNodes);
            // for (let [typeName, value] of Object.entries(categoryNodes)) {
            //     nodesDict[typeName] = value.ctr;
            // }
        }
        // console.log("nodesDict", nodesDict);
        return nodesDict;
    }, []);
    
    const getState = useCallback(() => {
        const state = [...elements];
        for (let [nodeId, args] of Object.entries(elementArgs)) {
            state[elemIndex[nodeId]].args = args;
        }
        return state;
    }, [elements, elementArgs, elemIndex]);
    
    return (
        <div style={{ height: '100%' }}
            id='workspace'
            onContextMenu={onContextmenu}
            onClick={onClick}
        >
            <ReactFlow
                elements={elements}
                //onLoad={(instance) => setReactFlowInstance(instance)}
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
