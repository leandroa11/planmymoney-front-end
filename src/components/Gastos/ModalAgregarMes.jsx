import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { convertirFecha, obtenerMesAnterior, obtenerNombreMes } from '../../utils/fechaUtils';
import { actualizarUsuario } from "../../services/updateUser";
import { Toast } from "primereact/toast";

export default function ModalAgregarMes({ setVisibleProp, calendarMesSeleccionadoProp, datosFinancierosProp, setDatosFinancierosSelectionProp, actualizarDatosProp, setActualizarDatosProp, setNewMonthProp, saldoActualProp }) {
    const [visible, setVisible] = useState(setVisibleProp);
    const toast = useRef(null);

    useEffect(() => {
        setVisible(setVisibleProp);
    }, [setVisibleProp]);

    const updateData = async () => {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));

        try {
            const { nombreMes, año } = obtenerNombreMes(convertirFecha(calendarMesSeleccionadoProp));
            const { nombreMes: nombreMesAnterior, año: añoAnterior } = obtenerNombreMes(obtenerMesAnterior(convertirFecha(calendarMesSeleccionadoProp)));

            const newMonthData = {
                gastos: [],
                ingresos: [],
                saldo_actual_mes: saldoActualProp,
                mes_cerrado: false,
            };

            let updatedDatosFinancieros = { ...datosFinancierosProp };

            if (updatedDatosFinancieros[añoAnterior] && updatedDatosFinancieros[añoAnterior][nombreMesAnterior.toLowerCase()]) {
                updatedDatosFinancieros[añoAnterior] = {
                    ...updatedDatosFinancieros[añoAnterior],
                    [nombreMesAnterior.toLowerCase()]: {
                        ...updatedDatosFinancieros[añoAnterior][nombreMesAnterior.toLowerCase()],
                        mes_cerrado: true
                    }
                };
            }

            if (updatedDatosFinancieros[año]) {
                if (!updatedDatosFinancieros[año][nombreMes.toLowerCase()]) {
                    updatedDatosFinancieros[año] = {
                        ...updatedDatosFinancieros[año],
                        [nombreMes.toLowerCase()]: newMonthData
                    };
                }
            } else {
                updatedDatosFinancieros[año] = {
                    [nombreMes.toLowerCase()]: newMonthData
                };
            }

            const _id = usuario._id;
            const updateDataObj = {
                datos_financieros: updatedDatosFinancieros
            };

            const data = await actualizarUsuario(_id, updateDataObj);
            if (data.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Lista actualizada correctamente', life: 3000 });
                setVisible(false);
                setDatosFinancierosSelectionProp(updatedDatosFinancieros);
                setActualizarDatosProp(actualizarDatosProp + 1);
                setNewMonthProp(false);
            }

        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la lista', life: 3000 });
            console.log('Error durante la actualización:', error);
        }
    };

    const onHide = () => {
        if (!visible) return;
        setVisible(false);
        setNewMonthProp(false)
    };

    const footerContent = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={() => updateData()} />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog header="Gestionar un mes nuevo" visible={visible} onHide={onHide}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={footerContent}>
                <p className="m-0">
                    ¿Deseas agregar un nuevo mes para gestionar?
                    EL mes anterior se guardará y no podrá ser editado.
                </p>
            </Dialog>
        </div>
    )
}
