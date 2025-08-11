import axios from 'axios';

// Configuración de la API
const API_URL = 'https://apigestor-bhd8bkf3chhmgkhb.centralus-01.azurewebsites.net/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Solo configurar el agente HTTPS en entorno de Node.js (no en el navegador)
if (typeof window === 'undefined') {
  const https = require('https');
  api.defaults.httpsAgent = new https.Agent({  
    rejectUnauthorized: false
  });
}

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      // El servidor respondió con un estado de error
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No response received:', error.request);
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión o inténtalo más tarde.');
    } else {
      // Algo más causó el error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getTasks = async () => {
  try {
    const response = await api.get('/Task'); // Cambiado a 'Task' con T mayúscula
    console.log('Tasks response:', response.data); // Para depuración
    return response.data;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    // Construir los parámetros de consulta
    const params = new URLSearchParams();
    if (taskData.title) params.append('title', taskData.title);
    if (taskData.description) params.append('description', taskData.description);
    
    const response = await api.post(`/Task?${params.toString()}`, '');
    return response.data;
  } catch (error) {
    console.error('Error al crear tarea:', error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    // Construir los parámetros de consulta
    const params = new URLSearchParams();
    if (taskData.title) params.append('title', taskData.title);
    if (taskData.description) params.append('description', taskData.description);
    if (taskData.completed !== undefined) params.append('completed', taskData.completed);
    
    const response = await api.put(`/Task/${id}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/Task/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    throw error;
  }
};

export default api;
