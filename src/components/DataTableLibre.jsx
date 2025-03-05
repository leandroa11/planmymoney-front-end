import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../App.css';
import { Slider } from 'primereact/slider';
import { Message } from 'primereact/message';
import { consultarUsuario } from '../services/getUser';
import { actualizarUsuario } from '../services/updateUser';
import { InputNumber } from 'primereact/inputnumber';

function DataTableLibre({ salarioLibrePrep, usuarioPrep }) {

    const [usoLibre, setUsoLibre] = useState();
    const [totalProcentaje, setTotalProcentaje] = useState(null);
    const [totalValor, setTotalValor] = useState(0);

    useEffect(() => {
        async function getUser() {
            try {
                const dataGastos = await consultarUsuario(usuarioPrep._id);
                setUsoLibre(dataGastos.data.uso_salario);
            } catch (error) {
                console.log('Error durante la consulta:', error);
            }
        }

        if (usuarioPrep && usuarioPrep._id) {
            getUser();
        }
    }, [usuarioPrep]);

    useEffect(() => {
        if (usoLibre) {
            setTotalProcentaje(usoLibre.reduce((acumulador, item) => acumulador + item.porcentaje, 0));
            setTotalValor(usoLibre.reduce((acumulador, item) => acumulador + item.valor, 0));
        }
    }, [usoLibre])

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
        const nuevoUsoLibre = { concepto, valor: parseInt(valor), porcentaje: calcularPorcentaje(valor) };
        setUsoLibre([...usoLibre, nuevoUsoLibre]);
        const updateData = {
            uso_salario: [...usoLibre, nuevoUsoLibre]
        };
        const update = await handleUpdate(updateData);
        if (update.status === 200) {
            toast.current.show({ severity: 'success', summary: 'Uso libre agregado', life: 3000 });
        }

        limpiarFormulario();
    };

    const handleDelete = async (rowData) => {
        setUsoLibre(usoLibre.filter((g) => g !== rowData));
        const updateData = {
            uso_salario: usoLibre.filter((g) => g !== rowData)
        };
        const update = await handleUpdate(updateData);
        if (update.status === 200) {
            toast.current.show({ severity: 'warn', summary: 'Uso libre eliminado', life: 3000 });
        }

    };

    const calcularPorcentaje = (valor) => parseFloat(((valor / salarioLibrePrep) * 100).toFixed(1));

    const limpiarFormulario = () => {
        setConcepto('');
        setValor('');
        setDialogVisible(false);
        setEditMode(false);
    };

    const header = (
        <div className="datatable-header">
            <span className="text-xl text-900 font-bold">Uso Libre</span>
            <Button label="Agregar Uso Libre" icon="pi pi-plus" className="p-mt-3" onClick={() => setDialogVisible(true)} />
        </div>
    );

    const onCellEditComplete = async (e) => {
        let { rowData, newValue, field } = e;
        rowData[field] = newValue;
        if (field === 'porcentaje') {
            rowData['valor'] = newValue * salarioLibrePrep / 100;
        }

        setTotalProcentaje(usoLibre.reduce((acumulador, item) => acumulador + item.porcentaje, 0));
        setTotalValor(usoLibre.reduce((acumulador, item) => acumulador + item.valor, 0));
        setUsoLibre(usoLibre);

        const updateData = {
            uso_salario: usoLibre
        };
        const update = await handleUpdate(updateData);
        if (update.status === 200) {
            toast.current.show({ severity: 'success', summary: 'Datos actualizados', life: 3000 });
        }

    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
    };

    const prorcentajeEditor = (options) => {

        return <>
            <span>{options.value}%</span>
            <Slider value={options.value} onChange={(e) => options.editorCallback(e.value)} />

        </>
    };
    
    const footer = (
        <tr role="row" className=''>
            <td role="cell" className="p-datatable-tfoot" style={{ textAlign: 'right' }}>Total porcentaje:</td>
            <td>{totalProcentaje}% - </td>
            <td role="cell" className="p-datatable-tfoot" style={{ textAlign: 'right' }}>Total valor:</td>
            <td>${totalValor.toLocaleString()}</td>
        </tr>
    );

    return (
        <div className="App">
            <div className="container">
                <Toast ref={toast} />
                <DataTable value={usoLibre} header={header} className="p-datatable-striped" selectionMode="single" tableStyle={{ minWidth: '60rem' }}
                    editMode="cell" dataKey="id" footer={footer} scrollable scrollHeight="400px"
                >
                    <Column field="concepto" header="Concepto" editor={(options) => textEditor(options)} onCellEditComplete={onCellEditComplete} style={{ width: '20%' }} />
                    <Column field="valor" header="Valor" body={(rowData) => `$ ${rowData.valor.toLocaleString()}`} style={{ width: '20%' }} />
                    <Column field="porcentaje" header="Porcentaje" body={(rowData) => `${rowData.porcentaje}%`} editor={(options) => prorcentajeEditor(options)} onCellEditComplete={onCellEditComplete} style={{ width: '20%' }} />
                    <Column
                        header="Acciones"
                        body={(rowData) => (

                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData)} />

                        )}
                    />
                </DataTable>
                <div className='messageFooter'>
                    {
                        totalProcentaje !== null && totalProcentaje !== 100 ?
                            <Message text={`Ajuste los porcentajes, la suma (${totalProcentaje}%) no es igual a 100%`} style={{ with: '-webkit-fill-available' }}
                                className='p-inline-message p-component p-inline-message-error'
                            />
                            :
                            null
                    }
                </div>

                <Dialog header={editMode ? 'Editar Uso Libre' : 'Agregar Uso Libre'} visible={isDialogVisible} onHide={limpiarFormulario} style={{ width: '450px' }}>
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

export default DataTableLibre;