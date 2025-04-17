export const convertirAFecha = (fechaStr) => {
    const [dia, mes, anio] = fechaStr.split('/').map(Number);
    return new Date(anio, mes - 1, dia);
};

export const convertirFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

export const obtenerNombreMes = (fecha) => {
    const [dia, mes, año] = fecha.split('/').map(Number);
    const fechaObjeto = new Date(año, mes - 1, dia);
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return {
        nombreMes: nombresMeses[fechaObjeto.getMonth()],
        año: año
    };
};

export const obtenerMesAnterior = (fechaStr) => {
    const [dia, mes, anio] = fechaStr.split('/').map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    // Restar un mes
    fecha.setMonth(fecha.getMonth() - 1);

    const diaAnterior = String(fecha.getDate()).padStart(2, '0');
    const mesAnterior = String(fecha.getMonth() + 1).padStart(2, '0');
    const anioAnterior = fecha.getFullYear();

    return `${diaAnterior}/${mesAnterior}/${anioAnterior}`;
};
