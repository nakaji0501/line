import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import InputForm from './pages/InputForm';
import TopPage from './pages/TopPage';
import ShyoushoPage from './pages/ShyoushoPage';
import KakuhoPage from './pages/KakuhoPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppContent = () => {
  const location = useLocation();
  const formRef = useRef();

  const handleSave = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <div className="App d-flex flex-column vh-100">
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/new" className="fs-4 fw-bold">生産実績入力アプリ</Navbar.Brand>
          <Nav className="header-nav-inline">
            <Nav.Link as={Link} to="/">TOP</Nav.Link>
            <Nav.Link as={Link} to="/new">新規</Nav.Link>
            <Nav.Link as={Link} to="/shyousho">仕様書</Nav.Link>
            <Nav.Link as={Link} to="/kakuho1">拡張1</Nav.Link>
            <Nav.Link as={Link} to="/kakuho2">拡張2</Nav.Link>
          </Nav>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-lg-none">
              <Nav.Link as={Link} to="/">TOP</Nav.Link>
              <Nav.Link as={Link} to="/new">新規</Nav.Link>
              <Nav.Link as={Link} to="/shyousho">仕様書</Nav.Link>
              <Nav.Link as={Link} to="/kakuho1">拡張1</Nav.Link>
              <Nav.Link as={Link} to="/kakuho2">拡張2</Nav.Link>
            </Nav>
            {location.pathname === '/new' && (
              <Button variant="success" onClick={handleSave} className="ms-auto">保存</Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 d-flex flex-column py-3">
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/new" element={<InputForm ref={formRef} />} />
          <Route path="/shyousho" element={<ShyoushoPage />} />
          <Route path="/kakuho1" element={<KakuhoPage pageName="拡張1" />} />
          <Route path="/kakuho2" element={<KakuhoPage pageName="拡張2" />} />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;