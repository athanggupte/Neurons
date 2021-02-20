import { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import NodeData from './NodeData';
import './node-style.css';

const InputNode = props => {
    
    return (
        <div>
            <Handle
                type='source'
                position='right'
            />
            <div className='Neuron'>
                <NodeData data={props.data}/>
            </div>
        </div>
    );
};

export default memo(InputNode);
