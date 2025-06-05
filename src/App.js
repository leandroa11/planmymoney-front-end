import React from 'react';
import Menu from './components/Menu';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css'
import './App.css';
import Inicio from './components/Inicio';

function App() {
  return (
    <div className="App">
      <Menu />
      <div className="container">
        <Inicio/>
      </div>
    </div>
  );
}

export default App;
