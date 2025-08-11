import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, FloatingLabel, Spinner } from 'react-bootstrap';
import { createTask, updateTask } from '../../services/api';

const TaskForm = ({ show, onHide, onSubmit, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    completed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      // Formatear la fecha para el input de tipo date
      const formattedDate = task.dueDate 
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : '';
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: formattedDate,
        completed: task.completed || false
      });
    } else {
      // Resetear el formulario cuando no hay tarea para editar
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        completed: false
      });
    }
    setError('');
  }, [task, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        await updateTask(task.id, formData);
      } else {
        // Crear nueva tarea
        await createTask(formData);
      }
      
      onSubmit();
    } catch (err) {
      setError('Error al guardar la tarea. Intente de nuevo.');
      console.error(err);
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

          <Form.Group className="mb-3">
            <Form.Label>Fecha de vencimiento</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Check
            type="switch"
            id="completed"
            name="completed"
            label="Completada"
            checked={formData.completed}
            onChange={handleChange}
            className="mb-3"
          />
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
