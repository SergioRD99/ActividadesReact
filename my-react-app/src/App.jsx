import { Container, Navbar, Nav } from 'react-bootstrap';
import TaskList from './components/tasks/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
        <Container>
          <Navbar.Brand href="#">
            <i className="bi bi-list-task me-2"></i>
            Gestor de Tareas
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#" active>
                <i className="bi bi-house-door me-1"></i> Inicio
              </Nav.Link>
              <Nav.Link href="#">
                <i className="bi bi-info-circle me-1"></i> Acerca de
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <Container>
          <TaskList />
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-light py-3 mt-auto">
        <Container className="text-center text-muted">
          <small>
            &copy; {new Date().getFullYear()} Gestor de Tareas - Desarrollado con React y Bootstrap
          </small>
        </Container>
      </footer>
    </div>
  );
}

export default App;
