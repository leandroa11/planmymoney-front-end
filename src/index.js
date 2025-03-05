import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import UsoSalario from './components/UsoSalario';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import Gastos from './components/Gastos/Gastos';
import Login from './components/login';
import RegistroUsuarios from './components/RegistroUsuarios';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Inicio" element={<App />} />
        <Route path="/UsoSalario" element={<UsoSalario />} />
        <Route path="/Gastos" element={<Gastos />} />
        <Route path="/RegistroUsuarios" element={<RegistroUsuarios />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);
