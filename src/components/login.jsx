import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import CryptoJS from 'crypto-js';

function Login() {

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [checked, setChecked] = useState(false);

    const toast = React.useRef(null);

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/Inicio');
    };

    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;



    const loginUser = async () => {
        if (!correo || !contrasena) {
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'Todos los campos son obligatorios', life: 3000 });
            return;
        }
        try {
            const contrasena_hash = CryptoJS.AES.encrypt(contrasena, SECRET_KEY).toString();
            const credenciales = {
                correo,
                contrasena_hash,
            };
            console.log(credenciales);
            
            const login = await axios.post(`${process.env.REACT_APP_API_URL}/usuarios/login`, credenciales, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(login);
            
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `${login.data.mensaje}`, life: 3000 });

            if (login.status === 200) {
                setTimeout(() => {
                    setCorreo('');
                    setContrasena('');
                    handleNavigate()
                    sessionStorage.setItem("usuario", JSON.stringify(login.data.usuario));
                }, 1000)
            }

        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: `No se pudo iniciar sesión, ${error.response.data.mensaje}`, life: 3000 });
            console.log(error);
        }
    }

    return (
        <div className="flex align-items-center justify-content-center" style={{ marginTop: '230px' }}>
            <Toast ref={toast} />
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                <div className="text-center mb-5">
                    <img src="/logoPlanMyMoney.png" alt="hyper" height={80} className="" />
                    <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                    <span className="text-600 font-medium line-height-3">¿No tienes una cuenta?</span>
                    <Link to="/RegistroUsuarios" style={{ textDecoration: 'none' }}>
                        <span className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">¡Crear ahora!</span>
                    </Link>
                </div>
                <div>
                    <label htmlFor="email" className="block text-900 font-medium mb-2">Correo</label>
                    <InputText id="email" value={correo} type="text" placeholder="Correo" className="w-full mb-3" onChange={(e) => setCorreo(e.target.value)} />
                    <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
                    <InputText id="password" value={contrasena} type="password" placeholder="Contraseña" className="w-full mb-3" onChange={(e) => setContrasena(e.target.value)} />
                    <div className="flex align-items-center justify-content-between mb-6">
                        <div className="flex align-items-center">
                            <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                            <label htmlFor="rememberme">Recuérdame</label>
                        </div>
                        <span className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">¿Olvidaste tu contraseña?</span>
                    </div>
                    <Button label="Iniciar Sesión" icon="pi pi-user" className="w-full" onClick={loginUser} />
                </div>
            </div>
        </div>
    );
}

export default Login;
