import React from 'react';
import ReactDOM from 'react-dom';
import Roteador from './componentes/Roteador/roteador';
import reportWebVitals from './reportWebVitals';
import './styles.css'

ReactDOM.render(
  <React.StrictMode>
    <Roteador />
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
