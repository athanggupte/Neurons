import { memo, useState, useEffect } from 'react';
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
    
    const [args, setArgs] = useState({
        units: 32,
    });
    
    useEffect(() => {
        props.data.onArgsChange(args);
    }, [args]);
    
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
            <input
                data-id= 'units'
                type='number'
                placeholder='units'
                style={{ width: '80%', textAlign: 'center' }}
                defaultValue={32}
                onChange={(event) => {
                    const ar = {...args};
                    ar.units = parseInt(event.target.value);
                    setArgs(ar);
                }}
            />
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
                    'Activation Node'
                }
            </div>
            <Select options={options} onChange={props.data.onChange} />
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
