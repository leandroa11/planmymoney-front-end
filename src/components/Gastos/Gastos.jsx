import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { addLocale } from 'primereact/api';
import { consultarUsuario } from '../../services/getUser';
import { AutoComplete } from 'primereact/autocomplete';
import { actualizarUsuario } from '../../services/updateUser';
import { Toast } from 'primereact/toast';
import { ScrollPanel } from 'primereact/scrollpanel';
import { convertirAFecha, convertirFecha, obtenerNombreMes } from '../../utils/fechaUtils';
import Menu from '../Menu';
import ModalSalarioActual from './ModalSalarioActual';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ModalAgregarMes from './ModalAgregarMes';
/* import { InputText } from 'primereact/inputtext'; */

const Gastos = () => {

    const [datosFinancieros, setDatosFinancieros] = useState();
    const [gastos, setGastos] = useState({});
    const [ingresos, setIngresos] = useState({});
    const [calendarMesSeleccionado, setCalendarMesSeleccionado] = useState();
    const [lastDay, setLastDate] = useState();
    const [mesSeleccionado, setMesSeleccionado] = useState();
    const [añoSeleccionado, setAñoSeleccionado] = useState();
    const [saldoActual, setSaldoActual] = useState(0);
    const [listaGastos, setListaGastos] = useState([]);
    const [updateData, setUpdateData] = useState(false);
    const [modalVisible, setModalVisible] = useState();
    const [modalVisibleMes, setModalVisibleMes] = useState();
    const [actualizarSaldo, setActualizarSaldo] = useState(0);
    const toast = useRef(null);

    addLocale('es', {
        firstDayOfWeek: 1,
        showMonthAfterYear: true,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    });

    useEffect(() => {

        const usuario = JSON.parse(sessionStorage.getItem("usuario"));

        async function getUser() {
            try {
                const data = await consultarUsuario(usuario._id);
                setSaldoActual(data.data.saldo_actual);

                if (data.data.saldo_actual === 0) {
                    setModalVisible(true);
                }
                let datosFinancieros = data.data.datos_financieros;
                const claves = Object.keys(datosFinancieros); 
                const ultimaClave = claves[claves.length - 1];
                const year = Object.keys(data.data.datos_financieros)[0];
                const monthName = Object.keys(data.data.datos_financieros[year])[0];

                const meses = {
                    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
                    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
                };

                const fecha = new Date(year, meses[monthName], 1);
                setMesSeleccionado(monthName);
                setAñoSeleccionado(year);
                setCalendarMesSeleccionado(fecha);
                let lastDay = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
                setLastDate(lastDay);
                setDatosFinancieros(data.data.datos_financieros);
                setListaGastos(data.data.gastos_obligatorios);
                if (data.data.datos_financieros[year][monthName]) {
                    setGastos(data.data.datos_financieros[year][monthName]);
                    setIngresos(data.data.datos_financieros[year][monthName]);
                }
            } catch (error) {
                console.log('Error durante la consulta:', error);
            }
        }



        if (usuario && usuario._id) {
            getUser();
        }
    }, []);

    useEffect(() => {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        async function updateUser() {
            try {
                const _id = usuario._id;

                const updateSaldoActual = actualizarSaldo >= 0 ?
                    datosFinancieros[añoSeleccionado][mesSeleccionado].saldo_actual_mes - actualizarSaldo
                    :
                    datosFinancieros[añoSeleccionado][mesSeleccionado].saldo_actual_mes + Math.abs(actualizarSaldo);

                const updatedDatosFinancieros = {
                    ...datosFinancieros,
                    [añoSeleccionado]: {
                        ...datosFinancieros[añoSeleccionado],
                        [mesSeleccionado]: {
                            ...datosFinancieros[añoSeleccionado][mesSeleccionado],
                            saldo_actual_mes: updateSaldoActual
                        }
                    }
                };

                const updateData = {
                    saldo_actual: updateSaldoActual,
                    datos_financieros: updatedDatosFinancieros
                };

                setSaldoActual(saldoActual - actualizarSaldo);
                setActualizarSaldo(0);

                const data = await actualizarUsuario(_id, updateData);

                if (data.status === 200) {
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Lista actualizada correctamente', life: 3000 });
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la lista', life: 3000 });
                console.log('Error durante la actualización:', error);
            }
        }
        if (usuario && usuario._id && updateData) {
            updateUser();
            setUpdateData(false);
        }

    }, [datosFinancieros, updateData, añoSeleccionado, mesSeleccionado, actualizarSaldo, saldoActual]);

    function updateSaldo(value, oldValue) {
        switch (true) {
            case value > oldValue:
                return (value - oldValue);
            case value < oldValue:
                return (value - oldValue);
            default:
                return (value);
        }
    };

    const agregarFila = (tipo, año, mes) => {
        const nuevoRegistro = { concepto: '', valor: 0, fecha: '' };
        if (tipo === 'Gasto') {
            setGastos(prev => ({
                ...prev,
                gastos: [...(prev['gastos'] || []), nuevoRegistro]
            }));
        } else if (tipo === 'Ingreso') {
            setIngresos(prev => ({
                ...prev,
                ingresos: [...(prev['ingresos'] || []), nuevoRegistro]
            }));
        }
        setDatosFinancieros(prev => {
            const añoActualizado = { ...prev[año] } || {};
            const mesActualizado = { ...añoActualizado[mes.toLowerCase()] } || { gastos: [], ingresos: [] };

            if (tipo === 'Gasto') {
                mesActualizado.gastos = [...mesActualizado.gastos, nuevoRegistro];
            } else if (tipo === 'Ingreso') {
                mesActualizado.ingresos = [...mesActualizado.ingresos, nuevoRegistro];
            }

            return {
                ...prev,
                [año]: {
                    ...prev[año],
                    [mes.toLowerCase()]: mesActualizado
                }
            };
        });
        setUpdateData(true);
    };

    const actualizarDato = (tipo, index, field, value) => {
        if (tipo === 'Gasto') {
            const actualizados = [...(gastos['gastos'] || [])];
            const oldValue = actualizados[index][field];
            actualizados[index][field] = value;
            if (field === 'valor') {
                setActualizarSaldo(updateSaldo(value, oldValue));
            }
            setGastos(prev => ({ ...prev, gastos: actualizados }));
        } else if (tipo === 'Ingreso') {
            const actualizados = [...(ingresos['ingresos'] || [])];
            const oldValue = actualizados[index][field];
            actualizados[index][field] = value;
            if (field === 'valor') {
                setActualizarSaldo(updateSaldo(value, oldValue) * -1);
            }
            setIngresos(prev => ({ ...prev, ingresos: actualizados }));
        }
    };

    const eliminarFila = (tipo, index) => {
        const month = (obtenerNombreMes(convertirFecha(calendarMesSeleccionado)).nombreMes.toLowerCase());
        const year = obtenerNombreMes(convertirFecha(calendarMesSeleccionado)).año;

        if (tipo === 'Gasto') {
            const actualizados = [...(gastos['gastos'] || [])];
            actualizados.splice(index, 1);
            setGastos(prev => ({ ...prev, gastos: actualizados }));
            setActualizarSaldo(gastos['gastos'][index].valor * -1);
            setDatosFinancieros(prev => ({
                ...prev,
                [year]: {
                    ...prev[year],
                    [month]: {
                        ...prev[year][month],
                        gastos: actualizados
                    }
                }
            }));
        } else if (tipo === 'Ingreso') {
            const actualizados = [...(ingresos['ingresos'] || [])];
            actualizados.splice(index, 1);
            setIngresos(prev => ({ ...prev, ingresos: actualizados }));
            setActualizarSaldo(ingresos['ingresos'][index].valor);
            setDatosFinancieros(prev => ({
                ...prev,
                [year]: {
                    ...prev[year],
                    [month]: {
                        ...prev[year][month],
                        ingresos: actualizados
                    }
                }
            }));
        }
    };

    const [filteredGastos, setFilteredGastos] = useState(null);
    const search = (event) => {
        setTimeout(() => {
            let _filteredGastos;

            if (!event.query.trim().length) {
                _filteredGastos = [...listaGastos];
            } else {
                _filteredGastos = listaGastos.filter((gasto) =>
                    gasto.concepto.toLowerCase().startsWith(event.query.toLowerCase())
                );
            }
            setFilteredGastos(_filteredGastos.map(g => ({ concepto: g.concepto, valor: g.valor })));
        }, 250);
    };

    const selectedConcepto = (tipo, index, field, value) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            actualizarDato(tipo, index, field, value.concepto);
            actualizarDato(tipo, index, "valor", value.valor);
        } else {
            actualizarDato(tipo, index, field, value);
        }
    };



    const renderRegistro = (tipo, registros) => {

        return registros.map((registro, index) => (
            <div className="card flex flex-wrap gap-3 p-fluid" style={{ marginBottom: '10px' }}>
                <div className="flex-auto">
                    <AutoComplete value={registro.concepto} field="concepto" suggestions={filteredGastos} completeMethod={search} dropdown onChange={(e) => {
                        selectedConcepto(tipo, index, 'concepto', e.target.value);
                    }} placeholder="Concepto" />
                    {/* <InputText value={registro.concepto} onChange={(e) => actualizarDato(tipo, index, 'concepto', e.target.value)} placeholder="Concepto" /> */}
                </div>
                <div className="flex-auto">
                    <InputNumber value={registro.valor} onValueChange={(e) => actualizarDato(tipo, index, 'valor', parseInt(e.target.value) || 0)}
                        className='' />
                </div>
                <div className="flex-auto">
                    <Calendar value={registro.fecha ? convertirAFecha(registro.fecha) : registro.fecha} onChange={(e) => {
                        actualizarDato(tipo, index, 'fecha', convertirFecha(e.target.value))
                    }} dateFormat="dd/mm/yy" placeholder="Fecha" minDate={calendarMesSeleccionado} maxDate={lastDay} readOnlyInput viewDate={calendarMesSeleccionado} />
                </div>
                <div className="flex-auto">
                    <Button
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={() => eliminarFila(tipo, index)}
                    />
                </div>
            </div>
        ));
    };

    const tittleCard = (tipo) => {
        return (
            <div className='datatable-header'>
                <span>{tipo}s</span>
                <Button label={`Agregar ${tipo}`} icon="pi pi-plus" onClick={() => {
                    const month = obtenerNombreMes(convertirFecha(calendarMesSeleccionado)).nombreMes;
                    const year = obtenerNombreMes(convertirFecha(calendarMesSeleccionado)).año;

                    agregarFila(tipo, year, month);
                }} />
            </div>
        );

    }
    const renderFooter = (tipo) => {
        return (
            <div className="flex justify-content-end">
                <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={() => setUpdateData(true)} />
            </div>
        );
    };

    const agregarMes = (value) => {
        setCalendarMesSeleccionado(value);
        const { nombreMes, año } = obtenerNombreMes(convertirFecha(calendarMesSeleccionado));

        setModalVisibleMes(true);
    }

    return (
        <div className="App">
            <Menu />
            <Toast ref={toast} />


            <div className="container">
                <h1>Gestión de Gastos e Ingresos</h1>

                <Calendar value={calendarMesSeleccionado} onChange={(e) => {
                    agregarMes(e.value);
                }} view="month" dateFormat="mm/yy" />

                <ModalSalarioActual
                    setVisiblePrep={modalVisible}
                    setCalendarMesSeleccionado={setCalendarMesSeleccionado}
                />
                <ModalAgregarMes
                    setVisiblePrep={modalVisibleMes}
                    calendarMesSeleccionadoPrep={calendarMesSeleccionado}
                />

                <h2>Saldo Actual: ${saldoActual}</h2>
                <div style={{ padding: '1rem' }}>
                    <div class="formgrid grid">
                        <div class="field col">
                            <Card title={tittleCard("Gasto")} className="p-mb-6" style={{ marginTop: '10px' }} footer={renderFooter("Gasto")}>
                                <ScrollPanel style={{ height: '400px' }}>
                                    {renderRegistro('Gasto', gastos["gastos"] || [])}
                                </ScrollPanel>
                            </Card>
                        </div>
                        <div class="field col">
                            <Card title={tittleCard("Ingreso")} className="p-mb-6" style={{ marginTop: '10px' }} footer={renderFooter("Ingreso")}>
                                <ScrollPanel style={{ height: '400px' }}>
                                    {renderRegistro('Ingreso', ingresos["ingresos"] || [])}
                                </ScrollPanel>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gastos;
