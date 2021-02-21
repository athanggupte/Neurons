import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import NodeGraph from './NodeWorkspace/NodeGraph';

function App() {
//     const [currentTime, setCurrentTime] = useState(0);    
//     useEffect(() => {
//             fetch('/time').then(res => res.json()).then(data => {
//                 setCurrentTime(data.time);
//             });
//         }, 
//         []  // <- This is to make sure that the effect has no dependencies
//             // and thus will not be called everytime there is a change
//             // to some state variable
//     );
    
    
    const [kernelInfo, setKernelInfo] = useState({})
    useEffect(() => {
            fetch('/ipyclient/connect').then(res => res.json()).then(data => {
                setKernelInfo(data);
            });
        },
        []
    );
    
    const [expr, setExpr] = useState('')
    const handleInput = event => {
        setExpr(event.target.value);
    };
        
    const [execResult, setExecResult] = useState('')
    const executeStatement = () => {
        fetch('/ipyclient/result', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            method: 'POST',
            body: JSON.stringify({
                'expr': expr
            })
        }).then(res => res.json())
        .then(data => {
            //console.log(data)
            if (data.shell.content.status == 'ok') {
                if (data.res.execute_result) {
                    setExecResult(data.res.execute_result.data['text/plain'])
                }
            } else if (data.res.status == 'error') {
                // Handle error
            }
        });
    };
    
    return (
    <div className="App" style={{ display: 'flex', flexFlow: 'column' }}>
        <header className="App-header">
            <span className="PlainText">
                {kernelInfo.banner ? kernelInfo.banner : 'Not Connected'}
            </span>
        </header>
        
        <NodeGraph />
        
    </div>
    );
}

export default App;
