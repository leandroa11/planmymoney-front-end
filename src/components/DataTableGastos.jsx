import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { consultarUsuario } from '../services/getUser';
import { actualizarUsuario } from '../services/updateUser';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../App.css';
import { InputNumber } from 'primereact/inputnumber';

function DataTableGastos({ salarioPrep, totalGastosPrep, setTotalGastosPrep, usuarioPrep }) {

    const [gastosObligatorios, setGastosObligatorios] = useState(null);

    const [porcentajeGastos, setPorcentajeGastos] = useState(0);

    useEffect(() => {
        async function getUser() {
            try {
                const dataGastos = await consultarUsuario(usuarioPrep._id);
                setGastosObligatorios(dataGastos.data.gastos_obligatorios);
            } catch (error) {
                console.log('Error durante la consulta:', error);
            }
        }

        if (usuarioPrep && usuarioPrep._id) {
            getUser();
        }
    }, [usuarioPrep]);

    useEffect(() => {
        if (gastosObligatorios && salarioPrep) {
            const total = gastosObligatorios.reduce((sum, gasto) => sum + gasto.valor, 0);
            const porcentaje = ((total / salarioPrep) * 100).toFixed(0);
            setTotalGastosPrep(total);
            setPorcentajeGastos(`${porcentaje}%`);
        }
    }, [gastosObligatorios, salarioPrep, setTotalGastosPrep]);


    const [selectedGasto, setSelectedGasto] = useState(null);
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [concepto, setConcepto] = useState('');
    const [valor, setValor] = useState('');
    const toast = React.useRef(null);

    const handleUpdate = async (object) => {
        try {
            const _id = usuarioPrep._id;
            return await actualizarUsuario(_id, object);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el salario', life: 3000 });
            console.log('Error durante la actualización:', error);
        }
    };

    const handleAdd = async () => {
        const nuevoGasto = { concepto, valor: parseInt(valor), porcentaje: calcularPorcentaje(valor) };
        if (editMode) {
            const lista = gastosObligatorios.map((g) => (g === selectedGasto ? nuevoGasto : g));
            setGastosObligatorios(lista);
            const updateData = {
                gastos_obligatorios: lista
            };
            const update = await handleUpdate(updateData);
            if (update.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Gasto actualizado', life: 3000 });
            }
        } else {
            setGastosObligatorios([...gastosObligatorios, nuevoGasto]);
            const updateData = {
                gastos_obligatorios: [...gastosObligatorios, nuevoGasto]
            };
            const update = await handleUpdate(updateData);
            if (update.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Gasto agregado', life: 3000 });
            }
        }
        limpiarFormulario();
    };

    const handleDelete = async (rowData) => {
        setGastosObligatorios(gastosObligatorios.filter((g) => g !== rowData));
        const updateData = {
            gastos_obligatorios: gastosObligatorios.filter((g) => g !== rowData)
        };
        const update = await handleUpdate(updateData);
        if (update.status === 200) {
            toast.current.show({ severity: 'warn', summary: 'Gasto eliminado', life: 3000 });
        }
    };

    const calcularPorcentaje = (valor) => `${((valor / salarioPrep) * 100).toFixed(1)}%`;

    const limpiarFormulario = () => {
        setConcepto('');
        setValor('');
        setDialogVisible(false);
        setEditMode(false);
    };

    const header = (
        <div className="datatable-header">
            <span className="text-xl text-900 font-bold">Gastos</span>
            <Button label="Agregar Gasto" icon="pi pi-plus" className="p-mt-3" onClick={() => setDialogVisible(true)} />
        </div>
    );

    const footer = `Total gastos: $${totalGastosPrep.toLocaleString()} (${porcentajeGastos})`;

    return (
        <div className="App">

            <div className="container">
                <Toast ref={toast} />
                <DataTable value={gastosObligatorios} header={header} footer={footer} className="p-datatable-striped" selectionMode="single" tableStyle={{ minWidth: '60rem' }} scrollable scrollHeight="400px" >
                    <Column field="concepto" header="Concepto" />
                    <Column field="valor" header="Valor" body={(rowData) => `$ ${rowData.valor.toLocaleString()}`} />
                    <Column field="porcentaje" header="Porcentaje" />
                    <Column
                        header="Acciones"
                        body={(rowData) => (
                            <>
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => {
                                    setEditMode(true);
                                    setSelectedGasto(rowData);
                                    setConcepto(rowData.concepto);
                                    setValor(rowData.valor);
                                    setDialogVisible(true);
                                }} />
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData)} />
                            </>
                        )}
                    />
                </DataTable>

                <Dialog header={editMode ? 'Editar Gasto' : 'Agregar Gasto'} visible={isDialogVisible} onHide={limpiarFormulario} style={{ width: '450px' }}>
                    <div className="grid p-fluid">
                        <div className="col-12">
                            <label htmlFor="concepto" className="block text-900 font-medium mb-2">Concepto</label>
                            <InputText id="concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} />
                        </div>
                        <div className="col-12">
                            <label htmlFor="valor" className="block text-900 font-medium mb-2">Valor</label>
                            <InputNumber id="valor" value={valor} onChange={(e) => setValor(e.value)} />
                        </div>
                    </div>
                    <div className="flex justify-content-end gap-3 mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={limpiarFormulario} />
                        <Button label={editMode ? 'Actualizar' : 'Agregar'} icon="pi pi-check" className="p-ml-2" onClick={handleAdd} />
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default DataTableGastos;
