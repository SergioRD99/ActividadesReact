import { Container, Navbar, Nav } from 'react-bootstrap';
import TaskList from './components/tasks/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm" sticky="top">
        <Container fluid="lg">
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <i className="bi bi-list-task me-2" style={{ fontSize: '1.5rem' }}></i>
            <span className="fw-bold">Gestor de Tareas</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link href="#" active className="d-flex align-items-center">
                <i className="bi bi-house-door me-1"></i> Inicio
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center">
                <i className="bi bi-info-circle me-1"></i> Acerca de
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="flex-grow-1 py-4 bg-light">
        <Container fluid="lg" className="h-100">
          <TaskList />
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-4">
        <Container fluid="lg" className="text-center text-muted">
          <small>
            &copy; {new Date().getFullYear()} Gestor de Tareas - Desarrollado con React y Bootstrap
          </small>
        </Container>
      </footer>
    </div>
  );
}

export default App;
