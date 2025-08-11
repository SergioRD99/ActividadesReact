import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert, Row, Col, Card as BootstrapCard } from 'react-bootstrap';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';
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

  const handleFormSubmit = async (taskData, updatedTask) => {
    try {
      // Cerrar el formulario primero para una mejor experiencia de usuario
      handleFormClose();
      
      if (updatedTask) {
        // Si es una tarea actualizada, actualizar el estado local
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        );
      } else {
        // Si es una nueva tarea, obtener la lista actualizada del servidor
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error in handleFormSubmit:', err);
      setError('Error al actualizar las tareas');
    }
  };

  return (
    <div className="container py-4">
      <div className="row align-items-center mb-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <h2 className="mb-0">Lista de tareas</h2>
        </div>
        <div className="col-12 col-md-6 text-md-end">
          <Button 
            variant="primary" 
            size="sm"
            className="px-3"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            <i className="bi bi-plus-lg me-1"></i> Nueva Tarea
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2 text-muted">Cargando tareas...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
          </div>
          <h5 className="text-muted mb-3">No hay tareas</h5>
          <p className="text-muted mb-4">Comienza creando tu primera tarea</p>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg me-2"></i> Crear Tarea
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {tasks.map((task) => (
            <Col key={task.id}>
              <div className="position-relative h-100">
                <BootstrapCard className="h-100 border-0" 
                  style={{
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                  }}>
                  <BootstrapCard.Body className="d-flex flex-column p-4">
                    {/* Status Badge with Icon and Label */}
                    <div className="position-absolute d-flex align-items-center gap-1" 
                         style={{ 
                           top: '1rem', 
                           right: '1rem',
                           background: task.completed ? 'rgba(46, 125, 50, 0.1)' : 'rgba(237, 108, 2, 0.1)',
                           padding: '4px 12px',
                           borderRadius: '16px',
                           border: `1px solid ${task.completed ? 'rgba(46, 125, 50, 0.3)' : 'rgba(237, 108, 2, 0.3)'}`,
                           backdropFilter: 'blur(4px)'
                         }}>
                      {task.completed ? (
                        <>
                          <CheckCircleIcon 
                            color="success" 
                            fontSize="small"
                            style={{ marginRight: '6px' }}
                          />
                          <span className="small fw-medium" style={{ color: task.completed ? '#2e7d32' : '#ed6c02' }}>
                            Completada
                          </span>
                        </>
                      ) : (
                        <>
                          <NewReleasesIcon 
                            color="warning" 
                            fontSize="small"
                            style={{ marginRight: '6px' }}
                          />
                          <span className="small fw-medium" style={{ color: task.completed ? '#2e7d32' : '#ed6c02' }}>
                            Pendiente
                          </span>
                        </>
                      )}
                    </div>

                    {/* Task Title */}
                    <BootstrapCard.Title className="mb-3 fw-bold" style={{ fontSize: '1.25rem' }}>
                      {task.title}
                    </BootstrapCard.Title>
                    
                    {/* Task Description */}
                    {task.description && (
                      <BootstrapCard.Text className="text-muted mb-4" style={{ lineHeight: '1.5' }}>
                        {task.description}
                      </BootstrapCard.Text>
                    )}
                    
                    {/* Dates */}
                    <div className="mt-auto">
                      <div className="d-flex flex-column gap-3 small">
                        <div className="d-flex align-items-center text-muted">
                          <CalendarMonthIcon fontSize="small" className="me-2" style={{ color: '#6c757d' }} />
                          <div>
                            <div className="text-uppercase small" style={{ color: '#6c757d', fontSize: '0.7rem' }}>Creada</div>
                            <div className="fw-medium">
                              {new Date(task.createdAt).toLocaleString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        {task.updatedAt && (
                          <div className="d-flex align-items-center text-muted">
                            <AccessTimeIcon fontSize="small" className="me-2" style={{ color: '#6c757d' }} />
                            <div>
                              <div className="text-uppercase small" style={{ color: '#6c757d', fontSize: '0.7rem' }}>Actualizada</div>
                              <div className="fw-medium">
                                {new Date(task.updatedAt).toLocaleString('es-MX', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="d-flex gap-2 mt-3">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="flex-grow-1 d-flex align-items-center justify-content-center"
                          onClick={() => {
                            setEditingTask(task);
                            setShowForm(true);
                          }}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          <span>Editar</span>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="flex-grow-1 d-flex align-items-center justify-content-center"
                          onClick={() => handleDelete(task.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          <span>Eliminar</span>
                        </Button>
                      </div>
                    </div>
                  </BootstrapCard.Body>
                </BootstrapCard>
              </div>
            </Col>
          ))}
        </Row>
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
