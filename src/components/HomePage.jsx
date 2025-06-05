import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Timeline } from 'primereact/timeline';
import { Divider } from 'primereact/divider';
import { Carousel } from 'primereact/carousel';
import { Avatar } from 'primereact/avatar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Chip } from 'primereact/chip';
import { Menubar } from 'primereact/menubar';
import HeroPage from './HeroPage';

const Homepage = () => {

    const technologies = [
        'React', 'PrimeReact', 'PrimeBlocks', 'Express.js', 'MongoDB Atlas', 'Railway', 'Axios', 'Node.js'
    ];

    // Datos para el timeline de características
    const features = [
        {
            status: 'Control Total',
            date: 'Ingresos',
            icon: 'pi pi-wallet',
            color: '#34d399',
            description: 'Registra todos tus ingresos mensuales de manera detallada'
        },
        {
            status: 'Gestión Inteligente',
            date: 'Gastos',
            icon: 'pi pi-chart-line',
            color: '#f59e0b',
            description: 'Controla y categoriza tus gastos obligatorios y opcionales'
        },
        {
            status: 'Análisis Avanzado',
            date: 'Reportes',
            icon: 'pi pi-chart-bar',
            color: '#8b5cf6',
            description: 'Visualiza tendencias y patrones en tus finanzas'
        },
        {
            status: 'Acceso Global',
            date: 'Sincronización',
            icon: 'pi pi-cloud',
            color: '#06b6d4',
            description: 'Accede a tus datos desde cualquier dispositivo y ubicación'
        }
    ];

    const testimonios = [
        {
            nombre: 'Juan Pérez',
            comentario: 'PlanMyMoney me ayudó a organizar mis finanzas de manera sencilla y efectiva.',
            imagen: 'https://i.pravatar.cc/150?img=1'
        },
        {
            nombre: 'María Gómez',
            comentario: 'Gracias a esta aplicación, ahora puedo controlar mis gastos mensuales sin complicaciones.',
            imagen: 'https://i.pravatar.cc/150?img=2'
        },
        {
            nombre: 'Carlos Rodríguez',
            comentario: 'Una herramienta indispensable para llevar un seguimiento claro de mis ingresos y egresos.',
            imagen: 'https://i.pravatar.cc/150?img=3'
        },
    ];

    // Datos para preguntas frecuentes
    const faqs = [
        {
            question: '¿Cómo funciona la sincronización de datos?',
            answer: 'Tu información se almacena de forma segura en MongoDB Atlas con acceso global, permitiendo sincronización automática entre todos tus dispositivos en tiempo real.'
        },
        {
            question: '¿Es segura mi información financiera?',
            answer: 'Utilizamos encriptación de extremo a extremo y las mejores prácticas de seguridad bancaria para proteger toda tu información personal y financiera.'
        },
        {
            question: '¿Puedo acceder desde cualquier país?',
            answer: 'Sí, nuestra aplicación funciona globalmente con servidores distribuidos que garantizan acceso rápido desde cualquier ubicación del mundo.'
        },
        {
            question: '¿Qué dispositivos son compatibles?',
            answer: 'La aplicación es completamente responsiva y funciona en computadoras, tablets y smartphones con cualquier navegador moderno.'
        }
    ];

    const customizedMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                style={{ backgroundColor: item.color }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card className="mt-3 ml-3 shadow-2">
                <div className="flex flex-column">
                    <div className="text-xl font-bold text-primary mb-2">{item.status}</div>
                    <div className="text-lg font-medium mb-2">{item.date}</div>
                    <p className="text-600 line-height-3">{item.description}</p>
                </div>
            </Card>
        );
    };

    const itemTemplate = (testimonio) => {
        return (
            <div className="p-4 text-center">
                <Avatar image={testimonio.imagen} size="xlarge" shape="circle" className="mb-3" />
                <h5 className="mb-1">{testimonio.nombre}</h5>
                <p className="text-gray-600">{testimonio.comentario}</p>
            </div>
        );
    };

    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            label: 'Características',
            icon: 'pi pi-star',
            command: () => document.getElementById('caracteristicas')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            label: 'Cómo Funciona',
            icon: 'pi pi-cog',
            command: () => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            label: 'Testimonios',
            icon: 'pi pi-users',
            command: () => document.getElementById('testimonios')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            label: 'FAQ',
            icon: 'pi pi-question-circle',
            command: () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            label: 'Contacto',
            icon: 'pi pi-envelope',
            command: () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
        }
    ];

    return (
        <div className="p-4 md:p-6 lg:p-8" id="inicio">
            {/* Menubar - Fijo con z-index alto */}
            <div className="sticky left-0 right-0 bg-transparent backdrop-blur-md shadow-lg border-b border-gray-200" style={{ zIndex: 9999, top: '24px' }}>
                <Menubar model={items} />
            </div>

            {/* Hero Section */}
            <section id="caracteristicas">
                <HeroPage />
            </section>

            <Divider align="center">
                <span className="text-gray-500 font-medium"></span>
            </Divider>

            {/* Secciones Informativas */}
            <section className="w-full flex flex-col lg:flex-row gap-6 mb-8 justify-center items-stretch">
                <div className="flex-1 flex">
                    <Card title="¿Qué es PlanMyMoney?" className="text-center bg-gradient-to-r from-blue-100 via-white to-green-100 p-6 shadow-2 flex-1 flex flex-col justify-center w-full h-full">
                        <p className="text-gray-700 text-lg">
                            Esta aplicación permite a los usuarios registrar ingresos, gastos y calcular automáticamente el saldo mensual.
                            El sistema organiza la información por mes y año, y permite visualizar datos financieros de forma ordenada.
                            Cuenta con validación de saldos, registros protegidos y una lógica optimizada para agregar nuevos meses o años al historial financiero.
                        </p>
                    </Card>
                </div>
                <div className="flex-1 flex">
                    <Card title="Tecnologías Utilizadas" className="text-center bg-gradient-to-r from-blue-100 via-white to-green-100 p-6 shadow-2 flex-1 flex flex-col justify-center w-full h-full">
                        <div className="flex flex-wrap flex-row justify-content-center items-center text-center">
                            {technologies.map((tech, i) => (
                                <Chip key={i} label={tech} className="bg-blue-100 text-blue-900 p-2 mx-2 my-1" />
                            ))}
                        </div>
                    </Card>
                </div>
            </section>

            {/* Línea de Tiempo */}
            <Divider align="center">
                <span className="text-gray-500 font-medium">Como funciona</span>
            </Divider>

            {/* How it Works */}
            <section id="como-funciona" className="section py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Cómo Funciona</h2>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            Un proceso simple y elegante para transformar tu gestión financiera
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                        <Timeline value={features} align="alternate" className="customized-timeline"
                            marker={customizedMarker} content={customizedContent} />
                    </div>
                </div>
            </section>

            {/* Testimonios */}
            <Divider align="center">
                <span className="text-gray-500 font-medium">Testimonios</span>
            </Divider>

            <section id="testimonios">
                <Carousel value={testimonios} numVisible={1} numScroll={1} itemTemplate={itemTemplate} autoplayInterval={5000} />
            </section>

            <Divider align="center">
            </Divider>

            {/* FAQ Section */}
            <section id="faq" className="section py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Resolvemos las dudas más comunes sobre nuestra plataforma
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <Accordion multiple activeIndex={[0]}>
                            {faqs.map((faq, index) => (
                                <AccordionTab key={index}
                                    header={<span className="text-gray-900 font-semibold text-lg">{faq.question}</span>}
                                    className="border-b border-gray-100 last:border-b-0">
                                    <div className="px-6 py-4">
                                        <p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p>
                                    </div>
                                </AccordionTab>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            <Divider align="center">
            </Divider>

            {/* Llamado a la Acción */}
            <section id="contacto" className="text-center mt-8">
                <Button label="Comenzar Ahora" icon="pi pi-sign-in" className="p-button-lg" onClick={() => window.location.href = "/login"} />
            </section>
        </div>
    );
};

export default Homepage;