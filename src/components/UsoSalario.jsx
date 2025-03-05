import React, { useEffect, useState } from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../App.css';
import Menu from './Menu';
import DataTableGastos from './DataTableGastos';
import DataTableLibre from './DataTableLibre';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { actualizarUsuario } from '../services/updateUser';
import { Toast } from 'primereact/toast';
import { consultarUsuario } from '../services/getUser';

function UsoSalario() {

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    const [salario, setSalario] = useState(0);
    const [totalGastos, setTotalGastos] = useState(0);
    const porcentajeSalario = '100%';
    const salarioLibre = parseInt(salario) - parseInt(totalGastos);

    useEffect(() => {
        async function getUser() {
            try {
                const dataGastos = await consultarUsuario(usuario._id);
                setSalario(dataGastos.data.salario);
            } catch (error) {
                console.log('Error durante la consulta:', error);
            }
        }

        if (usuario && usuario._id) {
            getUser();
        }
    }, [usuario]);

    const toast = React.useRef(null);

    const handleUpdate = async () => {
        try {
            const _id = usuario._id;
            const updateData = {
                salario: salario
            };

            const data = await actualizarUsuario(_id, updateData);

            if (data.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Salario actualizado correctamente', life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el salario', life: 3000 });
            console.log('Error durante la actualización:', error);
        }
    };

    return (
        <div className="App">

            <Toast ref={toast} />
            <Menu />
            <div className="container">
                <h2>Uso de Salario</h2>
                <div className="salario-info">
                    <strong style={{ paddingRight: '10px' }}>Salario Total:</strong>
                    <div className="p-inputgroup" style={{ width: 'auto' }}>
                        <InputNumber value={salario} onChange={(e) => setSalario(e.value)} type="text" className="p-inputtext-sm" />
                        <Button icon="pi pi-check" className="p-button-success" onClick={() => handleUpdate()} />
                    </div>
                </div>
                <h3>Gastos Obligatorios</h3>
                <DataTableGastos
                    salarioPrep={salario}
                    totalGastosPrep={totalGastos}
                    setTotalGastosPrep={setTotalGastos}
                    usuarioPrep={usuario}
                />
                <h3>Uso de Salario Libre</h3>
                <div className="salario-info">
                    <strong>Salario Libre:</strong> $ {salarioLibre.toLocaleString()} ({porcentajeSalario})
                </div>
                <DataTableLibre
                    usuarioPrep={usuario}
                    salarioLibrePrep={salarioLibre}
                />
            </div>
        </div>
    );
}

export default UsoSalario;
