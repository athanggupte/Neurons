import { memo, useState, useEffect } from 'react';
import { Handle } from 'react-flow-renderer';
import Select from 'react-select';
import './node-style.css'; 

const InputNode = props => {
    
    const [args, setArgs] = useState({
        shape: [],
    });
    
    useEffect(() => {
        props.data.onArgsChange(args);
    }, []);
    
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
                    'Input Node'
                }
            </div>
            <input
                data-id='shape'
                type='text'
                placeholder='shape'
                onChange={(event) => {
                    const ar = {...args};
                    ar.shape = event.target.value.split(',').forEach((els) => parseInt(els));
                }}
            />            
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
    }, []);
    
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
    
    const [args, setArgs] = useState({
        activation: options[0].value,
    });
    
    useEffect(() => {
        props.data.onArgsChange(args);
    }, []);
    
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
                    'Activation Node'
                }
            </div>
            <Select
                data-id= 'activation'
                options={options}
                defaultValue={options[0]}
                onChange={ (selectedOption) => {
                    const ar = {...args};
                    ar.activation = selectedOption.value;
                    setArgs(ar);
                }}
                isClearable={false}
            />
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

const defaultArgs = {
    InputNode: { shape: [16,1] },
    OutputNode: {},
    DenseNode: { units: 32, activation: null },
    ActivationNode: { activation: 'relu' },
};

export { defaultArgs };
