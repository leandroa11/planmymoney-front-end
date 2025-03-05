import axios from 'axios';

export const actualizarUsuario = async (id, datosActualizados) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/usuarios/${id}`,datosActualizados, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (error) {
        console.error('Error al actualizar usuario:', error.response?.data || error.message);
    }
};