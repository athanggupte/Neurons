import ReactFlow from 'react-flow-renderer';
//import Shape from 

const NeuralNode = props => {
    return (
        <div>
            <div>{props.data.label}</div>
        </div>
    );
};

export default NeuralNode;
