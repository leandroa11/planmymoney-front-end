
import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { convertirFecha, obtenerNombreMes } from '../../utils/fechaUtils';
import { actualizarUsuario } from "../../services/updateUser";
import { Toast } from "primereact/toast";

export default function ModalSalarioActual({ setVisibleProp, setCalendarMesSeleccionadoProp, setSaldoActualProp }) {
    const [visible, setVisible] = useState(setVisibleProp);
    const [saldoActual, setSaldoActual] = useState(0);
    const [mesAnio, setMesAnio] = useState(null);
    const [saldoActualInvalid, setSaldoActualInvalid] = useState(false);
    const [mesAnioInvalid, setMesAnioInvalid] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        setVisible(setVisibleProp);
    }, [setVisibleProp]);

    const updateData = async () => {

        const usuario = JSON.parse(sessionStorage.getItem("usuario"));

        if (saldoActual === 0 && mesAnio === null) {
            setSaldoActualInvalid(true);
            setMesAnioInvalid(true);
        } else {
            try {
                const { nombreMes, año } = obtenerNombreMes(convertirFecha(mesAnio));
                const datosFinancieros = {
                    [año]: {
                        [nombreMes.toLowerCase()]: {
                            gastos: [],
                            ingresos: [],
                            saldo_actual_mes: saldoActual,
                            mes_cerrado: false,
                        }
                    }
                };
                const _id = usuario._id;
                const updateData = {
                    saldo_actual: saldoActual,
                    datos_financieros: datosFinancieros
                };

                const data = await actualizarUsuario(_id, updateData);

                if (data.status === 200) {
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Lista actualizada correctamente', life: 3000 });
                    setVisible(false);
                    setSaldoActualInvalid(false);
                    setMesAnioInvalid(false);
                    setSaldoActualProp(saldoActual);
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la lista', life: 3000 });
                console.log('Error durante la actualización:', error);
            }
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
            <Dialog header="Ingresa tu saldo actual" visible={visible} onHide={() => { if (!visible) return; setVisible(false); }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={footerContent}>
                <p className="m-0">
                    Para comenzar a gestionar tus gastos, ingresa tu saldo actual y selecciona el mes y el año al que corresponde este saldo.
                </p>

                <div className="p-fluid mt-3">
                    <label htmlFor="saldoActual">Saldo Actual</label>
                    <InputNumber id="saldoActual" value={saldoActual} onValueChange={(e) => setSaldoActual(e.value)} placeholder="Ingresa tu saldo actual" invalid={saldoActualInvalid} />
                    {saldoActualInvalid ? <span className="invalidState">Debe Ingresar un saldo</span> : ""}
                </div>

                <div className="p-fluid mt-3">
                    <label htmlFor="mesAnio">Mes y Año</label>
                    <Calendar id="mesAnio" value={mesAnio} onChange={(e) => {
                        setMesAnio(e.value);
                        setCalendarMesSeleccionadoProp(e.value)
                    }} view="month" dateFormat="mm/yy" showIcon placeholder="Selecciona el mes y año" invalid={mesAnioInvalid} />
                    {mesAnioInvalid ? <span className="invalidState">Debe Seleccionar una fecha</span> : ""}
                </div>
            </Dialog>
        </div>
    )
}
