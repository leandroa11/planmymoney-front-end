import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

function RegisterUser() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [fechaRegistro] = useState(new Date());
    const toast = React.useRef(null);

    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

    const handleRegister = async () => {
        if (!nombre || !correo || !contrasena) {
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'Todos los campos son obligatorios', life: 3000 });
            return;
        }

        try {
            const contrasena_hash = CryptoJS.AES.encrypt(contrasena, SECRET_KEY).toString();
            const usuario = {
                _id: uuidv4(),
                nombre,
                correo,
                contrasena_hash,
                fecha_registro: fechaRegistro.toISOString(),
                ultima_sesion: null,
                salario: 0,
                saldo_actual: 0,
                gastos_obligatorios: [],
                uso_salario: [],
                datos_financieros: {},
            };

            await axios.post(`${process.env.REACT_APP_API_URL}/usuarios/registrar`, usuario, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado correctamente', life: 3000 });

            setNombre('');
            setCorreo('');
            setContrasena('');
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el usuario', life: 3000 });
            console.log(error);
        }
    };

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/');
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ marginTop: '100px' }}>
            <Toast ref={toast} />
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                <h3 className="text-center text-green-500">Registro de Usuario</h3>
                <div className="grid p-fluid">
                    <div className="col-12">
                        <label htmlFor="nombre" className="block text-900 font-medium mb-2">Nombre</label>
                        <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="w-full" />
                    </div>
                    <div className="col-12">
                        <label htmlFor="correo" className="block text-900 font-medium mb-2">Correo</label>
                        <InputText id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" className="w-full" />
                    </div>
                    <div className="col-12">
                        <label htmlFor="contrasena" className="block text-900 font-medium mb-2">Contraseña</label>
                        <Password id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Contraseña" className="w-full" toggleMask />
                    </div>
                    <div className="col-12">
                        <label htmlFor="fechaRegistro" className="block text-900 font-medium mb-2">Fecha de Registro</label>
                        <Calendar id="fechaRegistro" value={fechaRegistro} disabled readOnlyInput className="w-full" />
                    </div>
                </div>

                <Button label="Registrar" icon="pi pi-user" className="w-full" onClick={handleRegister} />
                <Button label="Cancelar" icon="pi pi-times" className="w-full" onClick={handleNavigate} style={{ marginTop: '15px' }} text />
            </div>
        </div>
    );
}

export default RegisterUser;
