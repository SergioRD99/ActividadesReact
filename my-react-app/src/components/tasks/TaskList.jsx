import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { getTasks, deleteTask } from '../../services/api';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching tasks...');
      const data = await getTasks();
      console.log('Tasks received:', data);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error in fetchTasks:', err);
      setError(err.message || 'Error al cargar las tareas. Verifica la conexión con el servidor.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(id);
        await fetchTasks();
      } catch (err) {
        setError('Error al eliminar la tarea');
        console.error(err);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async () => {
    await fetchTasks();
    handleFormClose();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Tareas</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Nueva Tarea
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : tasks.length === 0 ? (
        <Alert variant="info">No hay tareas disponibles. ¡Crea una nueva tarea para comenzar!</Alert>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {tasks.map((task) => (
              <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{task.title}</h5>
                  <p className="mb-1 text-muted">{task.description}</p>
                  <div>
                    <Badge bg={task.completed ? 'success' : 'secondary'} className="me-2">
                      {task.completed ? 'Completada' : 'Pendiente'}
                    </Badge>
                    <small className="text-muted">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(task)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}

      <TaskForm 
        show={showForm} 
        onHide={handleFormClose} 
        onSubmit={handleFormSubmit}
        task={editingTask}
      />
    </div>
  );
};

export default TaskList;
