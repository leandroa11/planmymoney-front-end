import axios from 'axios';

export const consultarUsuario = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuarios/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (error) {
        console.error('Error al actualizar usuario:', error.response?.data || error.message);
    }
};