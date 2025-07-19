import React, { useRef, useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import InputForm from './pages/InputForm';
import TopPage from './pages/TopPage';
import ShyoushoPage from './pages/ShyoushoPage';
import KakuhoPage from './pages/KakuhoPage';
import DataAddPage from './pages/DataAddPage'; // DataAddPageをインポート
import { auth } from './firebaseConfig.js';
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"; // Firebase Auth関連をインポート
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
  const [user, setUser] = useState(null); // ユーザー状態を管理

  const [formData, setFormData] = useState(initialFormData);
  const [processingDefects, setProcessingDefects] = useState(initialProcessingDefects);
  const [inspectionDefects, setInspectionDefects] = useState(initialInspectionDefects);

  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Googleログインエラー: ", error);
      alert("Googleログインに失敗しました。");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー: ", error);
      alert("ログアウトに失敗しました。");
    }
  };

  const handleSave = async () => {
    if (formRef.current) {
      const isSaved = await formRef.current.submit();
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

  const handleReset = () => {
    if (window.confirm('リセットしますか？')) {
      setFormData(initialFormData);
      setProcessingDefects(initialProcessingDefects);
      setInspectionDefects(initialInspectionDefects);
      setHasUnsavedChangesInForm(false);
    }
  };

  const handleNewInput = useCallback(() => {
    const resetState = () => {
      setFormData(initialFormData);
      setProcessingDefects(initialProcessingDefects);
      setInspectionDefects(initialInspectionDefects);
      setHasUnsavedChangesInForm(false);
      navigate('/new');
    };

    if (hasUnsavedChangesInForm) {
      if (window.confirm('入力フォームに未保存のデータがあります。リセットして新規入力しますか？')) {
        resetState();
      }
    } else {
      resetState();
    }
  }, [hasUnsavedChangesInForm, navigate]);

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
            <div className="ms-auto">
              {user ? (
                <Button variant="outline-light" onClick={handleLogout}>ログアウト ({user.displayName})</Button>
              ) : (
                <Button variant="outline-light" onClick={handleGoogleLogin}>Googleログイン</Button>
              )}
            </div>
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