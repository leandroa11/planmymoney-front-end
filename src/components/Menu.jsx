import React from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../App.css';
import { Menubar } from 'primereact/menubar';
import { Link } from 'react-router-dom';

function Menu() {

  const limiarDatosSesion = () => {
    localStorage.clear();
  }

  const menuItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      template: (item, options) => (
        <Link to="/" className={options.className} style={{ textDecoration: 'none' }}>
          {item.label}
        </Link>
      ),
    },
    {
      label: 'Uso de Salario',
      icon: 'pi pi-dollar',
      template: (item, options) => (
        <Link to="/UsoSalario" className={options.className} style={{ textDecoration: 'none' }}>
          {item.label}
        </Link>
      ),
    },
    {
      label: 'Ahorros',
      icon: 'pi pi-chart-line',
      template: (item, options) => (
        <Link to="/Ahorros" className={options.className} style={{ textDecoration: 'none' }}>
          {item.label}
        </Link>
      ),
    },
    {
      label: 'Gastos',
      icon: 'pi pi-chart-line',
      template: (item, options) => (
        <Link to="/Gastos" className={options.className} style={{ textDecoration: 'none' }}>
          {item.label}
        </Link>
      ),
    },
    {
      label: 'Opciones',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Configuraciones',
          icon: 'pi pi-sliders-h',
          template: (item, options) => (
            <Link to="/" className={options.className} style={{ textDecoration: 'none' }}>
              {item.label}
            </Link>
          ),
        },
        {
          label: 'Salir',
          icon: 'pi pi-power-off',
          template: (item, options) => (
            <Link to="/" className={options.className} style={{ textDecoration: 'none' }} onClick={limiarDatosSesion()}>
              {item.label}
            </Link>
          ),
        }
      ]
    }
  ];

  return (
    <div className="App">
      <Menubar model={menuItems} />
    </div>
  );
}

export default Menu;
