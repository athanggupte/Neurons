# Neurons

Neurons is a visual graph editor for neural networks based on [React Flow](https://reactflow.dev/) with [Keras](https://keras.io/) as the target framework.


## Dependencies

#### Python dependencies

Most dependecies are installed in the virtual environment for flask.  
But the following requirements are required to be installed in the global environment.

1. keras (tensorflow 2)
2. venv

#### Other

1. Nodejs (15.10.x or above)
2. npm (6.14.x or above)


## Installation

```bash
git clone https://github.com/xdevapps/Neurons.git
cd Neurons
npm init
npm init-flask

```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `npm run start-flask`

Runs the backend flask app in venv.  

The python script will reload if you make any edits.  
Debug messages will be shown in the terminal window.


<!--### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.-->
