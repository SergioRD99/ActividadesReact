import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, FloatingLabel, Spinner } from 'react-bootstrap';
import { createTask, updateTask } from '../../services/api';

const TaskForm = ({ show, onHide, onSubmit, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || ''
      });
    } else {
      // Resetear el formulario cuando no hay tarea para editar
      setFormData({
        title: '',
        description: ''
      });
    }
    setError('');
  }, [task, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (task) {
        // Actualizar tarea existente
        const updatedTask = await updateTask(task.id, formData);
        onSubmit(updatedTask);
      } else {
        // Crear nueva tarea
        const newTask = await createTask(formData);
        onSubmit(newTask);
      }
    } catch (err) {
      setError('Error al guardar la tarea. Intente de nuevo.');
      console.error('Error en handleSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{task ? 'Editar Tarea' : 'Nueva Tarea'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <FloatingLabel controlId="title" label="Título" className="mb-3">
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título de la tarea"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="description" label="Descripción" className="mb-3">
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción de la tarea"
              style={{ height: '100px' }}
            />
          </FloatingLabel>

          {task && (
            <Form.Check
              type="switch"
              id="completed"
              name="completed"
              label="Completada"
              checked={task.completed || false}
              onChange={async (e) => {
                if (task) {
                  try {
                    setLoading(true);
                    const updatedTask = await updateTask(task.id, {
                      ...formData,
                      completed: e.target.checked
                    });
                    // Actualizar el estado local del formulario
                    setFormData(prev => ({
                      ...prev,
                      completed: e.target.checked
                    }));
                    // Notificar al componente padre
                    if (onSubmit) {
                      onSubmit(updatedTask);
                    }
                  } catch (err) {
                    console.error('Error actualizando estado de la tarea:', err);
                    setError('Error al actualizar el estado de la tarea');
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              className="mb-3"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Guardando...
              </>
            ) : task ? (
              'Actualizar Tarea'
            ) : (
              'Crear Tarea'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TaskForm;
