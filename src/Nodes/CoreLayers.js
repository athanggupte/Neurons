import { memo, useState, useEffect, useCallback } from 'react';
import { Handle } from 'react-flow-renderer';
import Select from 'react-select';
import './node-style.css'; 


/******************************************
            InputNode
 ******************************************/
const InputNode = props => {
    
    const [args, setArgs] = useState({
        shape: [16,1],
    });
    
    useEffect(() => {
        props.data.onArgsChange(args);
    }, []);
    
    useEffect(() => {
        props.data.onArgsChange(args);
    }, [args]);
    
    const [editShapeMode, setEditShapeMode] = useState(false);
    
    const enableEditShapeMode = useCallback(() => { setEditShapeMode(true); }, []);
    
    const [changedShape, setChangedShape] = useState(args.shape);
    
    const applyShapeChanges = useCallback(() => { setArgs({ shape: changedShape }); setEditShapeMode(false); }, [changedShape]);
    
    const cancelShapeChanges = useCallback(() => { setChangedShape(args.shape); setEditShapeMode(false); }, [args]);
    
    const addDimension = useCallback(() => {
        const ar = [...changedShape];
        
    }, [changedShape]);
    
    const handleChange = useCallback((event) => {
        const idx = parseInt(event.target.getAttribute('data-id').substr(5));
        const shape = [...changedShape];
        shape[idx] = event.target.value;
        setChangedShape(shape);
    });
    
    const createShapeInputs = useCallback(() => {
        let shapeInputs = changedShape.map((dim, idx) => (
            <input
                key={idx}
                data-id={'shape'+idx}
                type='number'
                placeholder={'dim-'+idx}
                style={{ width: '80%' }}
                value={dim}
                onChange={handleChange}
            />
        ));
        shapeInputs = shapeInputs.concat(
            <button key='add' className='edit-btn' onClick={addDimension}>
                <i className='material-icons'>add</i>
            </button>
        );
        return shapeInputs;
    }, [changedShape]);
    
    const shapeStyle = {
        fontSize: 12,
        color: '#111',
        border: 'solid 1px #ccc',
        background: '#eee',
        margin: 2,
    };
    
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
            <p style={shapeStyle}>({args.shape.map((dim, idx) => ( dim + (idx < (args.shape.length - 1) ? ',' : '') ))})</p>
            {
                editShapeMode ? 
                (<>{createShapeInputs()} <br />
                    <button className='edit-btn' onClick={cancelShapeChanges}><i className='material-icons' style={{ color: 'red', fontWeight: 'bold' }}>clear</i></button>
                    <button className='edit-btn' onClick={applyShapeChanges}><i className='material-icons' style={{ color: 'green', fontWeight: 'bold' }}>done</i></button>
                </>) : 
                (<button className='edit-btn' onClick={enableEditShapeMode}><i className='material-icons'>mode_edit</i></button>)}
        </div>
    );
};

/******************************************
            OutputNode
 ******************************************/
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


/******************************************
            DenseNode
 ******************************************/
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
    
    const handleChange = useCallback((event) => {
        const ar = {...args};
        ar.units = parseInt(event.target.value);
        setArgs(ar);
    });
    
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
                onChange={handleChange}
            />
            <Handle
                type='target'
                position='left'
            />
        </div>
    );
};


/******************************************
            ActivationNode
 ******************************************/
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
    
    const handleChange = useCallback((selectedOption) => {
        const ar = {...args};
        ar.activation = selectedOption.value;
        setArgs(ar);
    });
    
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
                onChange={handleChange}
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
