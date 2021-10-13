import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import SingleMovePuzzle from './SingleMovePuzzle';
import reportWebVitals from './config/reportWebVitals';

ReactDOM.render(
  <React.Fragment>
    <SingleMovePuzzle />
  </React.Fragment>,
  document.getElementById('root')
);

reportWebVitals();
