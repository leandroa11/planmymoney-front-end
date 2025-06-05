import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const HeroPage = () => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-nogutter surface-0 text-800 ">
            <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
                <section className="w-full">
                    <span className="block text-6xl font-bold mb-1">Plan My Money</span>
                    <div className="text-6xl font-bold mb-3" style={{ color: '#4f46e5' }}>
                        La aplicación más avanzada para el control de finanzas personales.
                    </div>
                    <p className="mt-0 mb-4 text-700 line-height-3">
                        Gestiona ingresos, gastos y obtén insights inteligentes desde cualquier lugar del mundo.
                    </p>

                    <Button
                        label="Probar Demo"
                        icon="pi pi-camera"
                        className="p-button-raised"
                        onClick={() => navigate('/login')}
                    />
                </section>
            </div>
            <div className="col-12 md:col-6 overflow-hidden flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <img
                    src="/hero-image.jpg"
                    alt="hero-1"
                    className="md:ml-auto block"
                    style={{
                        clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)',
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                    }}
                />
            </div>
        </div>
    );
};

export default HeroPage;