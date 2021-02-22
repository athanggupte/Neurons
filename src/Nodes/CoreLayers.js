import { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import Select from 'react-select';
import './node-style.css'; 

const InputNode = props => {
    
    return (
        <div>
            <Handle
                type='source'
                position='right'
            />
            <div>
                {(props.data && props.data.label) ? 
                    props.data.label :
                    'Input Node'
                }
            </div>
        </div>
    );
};

const OutputNode = props => {
    
    return (
        <div>
            <Handle
                type='target'
                position='left'
            />
            <div>
                {(props.data && props.data.label) ? 
                    props.data.label :
                    'Output Node'
                }
            </div>
        </div>
    );
};

const DenseNode = props => {
    
    return (
        <div>
            <Handle
                type='source'
                position='right'
            />
            <div>
                {(props.data && props.data.label) ? 
                    props.data.label :
                    'Dense Node'
                }
            </div>
            <input type='number' style={{ width: '80%', textAlign: 'center' }} placeholder='units' defaultValue={32}/>
            <Handle
                type='target'
                position='left'
            />
        </div>
    );
};

const ActivationNode = props => {
    
    const options = [
        { value: 'relu', label: 'ReLU' },
        { value: 'sigmoid', label: 'Sigmoid' },
        { value: 'softmax', label: 'Softmax' },
        { value: 'elu', label: 'ELU' },
    ];
    
    return (
        <div>
            <Handle
                type='source'
                position='right'
            />
            <div>
                {(props.data && props.data.label) ? 
                    props.data.label :
                    'Dense Node'
                }
            </div>
            <Select options={options} />
            <Handle
                type='target'
                position='left'
            />
        </div>
    );
};

export default {
    InputNode: InputNode,
    OutputNode: OutputNode,
    DenseNode: DenseNode,
    ActivationNode: ActivationNode,
};
