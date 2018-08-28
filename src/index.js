import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/Routes';

const render = () => {
  ReactDOM.render(<Routes />, document.getElementById('root'))
}

render()