import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [currentTime, setCurrentTime] = useState(0);    
    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, 
    []  // <- This is to make sure that the effect has no dependencies
        // and thus will not be called everytime there is a change
        // to some state variable
    );
    
    
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
    <div className="App">
        <header className="App-header">
            <p className="PlainText">{kernelInfo.banner}</p>
        </header>
        
        
        <p>Current Time is {currentTime}</p>
        
        
        <input type="text" onChange={handleInput}></input>
        <button onClick={executeStatement}>Evaluate</button>
        
        <p className="PlainText">{execResult}</p>
        
    </div>
    );
}

export default App;
