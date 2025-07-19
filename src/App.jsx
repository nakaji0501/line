import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import InputForm from './pages/InputForm';
import TopPage from './pages/TopPage';
import ShyoushoPage from './pages/ShyoushoPage';
import KakuhoPage from './pages/KakuhoPage';
import DataAddPage from './pages/DataAddPage'; // DataAddPageをインポート
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialFormData = {
  date: new Date().toISOString().slice(0, 10),
  line: '',
  worker: '',
  inspector: '',
  customer: '',
  product: '',
  startTime: '',
  plannedQuantity: '',
  actualQuantity: '',
  douNomi: '',
  sokoNomi: '',
  notes: ''
};

const initialProcessingDefects = {
  douInsatsu: 0, douKizu: 0, douSonota: 0, sokoFuryo: 0, futaFuryo: 0
};

const initialInspectionDefects = {
  douInsatsu: 0, douKizu: 0, sokoKizuHekomi: 0, sokoMaki: 0, sonota: 0
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef();
  const [hasUnsavedChangesInForm, setHasUnsavedChangesInForm] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [processingDefects, setProcessingDefects] = useState(initialProcessingDefects);
  const [inspectionDefects, setInspectionDefects] = useState(initialInspectionDefects);

  const handleSave = () => {
    if (formRef.current) {
      const isSaved = formRef.current.submit();
      if (isSaved) {
        setFormData(initialFormData);
        setProcessingDefects(initialProcessingDefects);
        setInspectionDefects(initialInspectionDefects);
        setHasUnsavedChangesInForm(false);
        navigate('/'); // 保存後TOP画面へ移動
      } else {
        alert('保存に失敗しました。入力内容を確認してください。');
      }
    }
  };

  const handleNewInput = () => {
    if (hasUnsavedChangesInForm) {
      if (window.confirm('入力フォームに未保存のデータがあります。リセットして新規入力しますか？')) {
        setFormData(initialFormData);
        setProcessingDefects(initialProcessingDefects);
        setInspectionDefects(initialInspectionDefects);
        setHasUnsavedChangesInForm(false);
        navigate('/new'); // 入力フォームへ移動
      }
    } else {
      setFormData(initialFormData);
      setProcessingDefects(initialProcessingDefects);
      setInspectionDefects(initialInspectionDefects);
      setHasUnsavedChangesInForm(false);
      navigate('/new'); // 入力フォームへ移動
    }
  };

  const handleReset = () => {
    if (window.confirm('リセットしますか？')) {
      setFormData(initialFormData);
      setProcessingDefects(initialProcessingDefects);
      setInspectionDefects(initialInspectionDefects);
      setHasUnsavedChangesInForm(false);
    }
  };

  return (
    <div className="App d-flex flex-column vh-100">
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/new" className="fs-4 fw-bold">生産実績入力アプリ</Navbar.Brand>
          <Nav className="header-nav-inline">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>TOP</Nav.Link>
            <Nav.Link as={Link} to="/new" active={location.pathname === '/new'}>入力フォーム</Nav.Link>
            <Nav.Link as={Link} to="/shyousho" active={location.pathname === '/shyousho'}>仕様書</Nav.Link>
            <Nav.Link as={Link} to="/data-add" active={location.pathname === '/data-add'}>マスタ登録</Nav.Link>
            <Nav.Link as={Link} to="/kakuho1" active={location.pathname === '/kakuho1'}>拡張1</Nav.Link>
          </Nav>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-lg-none">
              <Nav.Link as={Link} to="/" active={location.pathname === '/'}>TOP</Nav.Link>
              <Nav.Link as={Link} to="/new" active={location.pathname === '/new'}>新規</Nav.Link>
              <Nav.Link as={Link} to="/shyousho" active={location.pathname === '/shyousho'}>仕様書</Nav.Link>
              <Nav.Link as={Link} to="/data-add" active={location.pathname === '/data-add'}>データ追加</Nav.Link>
              <Nav.Link as={Link} to="/kakuho1" active={location.pathname === '/kakuho1'}>拡張1</Nav.Link>
            </Nav>
            {location.pathname === '/new' && (
              <div className="ms-auto">
                <Button variant="success" onClick={handleSave} className="me-2">保存</Button>
                <Button variant="danger" onClick={handleReset}>リセット</Button>
              </div>
            )}
            {location.pathname === '/' && (
              <div className="ms-auto">
                <Button variant="success" onClick={handleNewInput}>新規入力</Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 d-flex flex-column py-3">
        <Routes>
          <Route path="/" element={<TopPage handleNewInput={handleNewInput} />} />
          <Route path="/new" element={<InputForm ref={formRef} onUnsavedChangesChange={setHasUnsavedChangesInForm} formData={formData} setFormData={setFormData} processingDefects={processingDefects} setProcessingDefects={setProcessingDefects} inspectionDefects={inspectionDefects} setInspectionDefects={setInspectionDefects} />} />
          <Route path="/shyousho" element={<ShyoushoPage />} />
          <Route path="/data-add" element={<DataAddPage />} />
          <Route path="/kakuho1" element={<KakuhoPage pageName="拡張1" />} />
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