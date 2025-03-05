
import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { convertirFecha, obtenerNombreMes } from '../../utils/fechaUtils';
import { actualizarUsuario } from "../../services/updateUser";
import { Toast } from "primereact/toast";

export default function ModalAgregarMes({ setVisiblePrep, calendarMesSeleccionadoPrep }) {
    const [visible, setVisible] = useState(setVisiblePrep);
    const toast = useRef(null);

    useEffect(() => {
        setVisible(setVisiblePrep);
    }, [setVisiblePrep]);

    const updateData = async () => {
        
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));

        try {
            const { nombreMes, año } = obtenerNombreMes(convertirFecha(calendarMesSeleccionadoPrep));
            const datosFinancieros = {
                [año]: {
                    [nombreMes.toLowerCase()]: {
                        gastos: [],
                        ingresos: [],
                        saldo_actual_mes: 0
                    }
                }
            };
            const _id = usuario._id;
            const updateData = {
                datos_financieros: datosFinancieros
            };

            const data = await actualizarUsuario(_id, updateData);

            /* if (data.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Lista actualizada correctamente', life: 3000 });
                setVisible(false);
                setSaldoActualInvalid(false);
                setMesAnioInvalid(false);
            } */
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la lista', life: 3000 });
            console.log('Error durante la actualización:', error);
        }
    };

    const footerContent = (
        <div>
            <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={() => updateData()} />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog header="Gestionar un mes nuevo" visible={visible} onHide={() => { if (!visible) return; setVisible(false); }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={footerContent}>
                <p className="m-0">
                    ¿Deseas agregar un nuevo mes para gestionar?
                </p>
            </Dialog>
        </div>
    )
}
