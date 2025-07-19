import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Row, Col, InputGroup, Modal, Card } from 'react-bootstrap';
import CustomerSelect from './CustomerSelect';

// --- マスターデータ（仮）---
const workers = ['加藤浩', '永吉則久', '藤田蓮', '中島拓海', '', '林洋子', '相浦絵美子', '石川美穂', '渡部加奈子', '中島里美', '重水明日香', '伊藤枝里子'];
const inspectors = ['林洋子', '相浦絵美子', '石川美穂', '渡部加奈子', '中島里美', '重水明日香', '伊藤枝里子', '', '加藤浩', '永吉則久', '藤田蓮', '中島拓海'];

// --- 不良数カウンターコンポーネント ---
const DefectCounter = ({ label, count, onCountChange, isLargeButton = false }) => (
  <Col xs={isLargeButton ? 12 : 6} sm={isLargeButton ? 12 : 4} md={isLargeButton ? 2 : 2} className="mb-1"> 
    <Card className="h-100 shadow-sm">
      <Card.Body className="p-1 d-flex flex-column justify-content-between"> 
        <Card.Title className="text-center mb-1" style={{ fontSize: isLargeButton ? '1.5rem' : '0.9rem' }}>{label}</Card.Title> 
        <InputGroup size={isLargeButton ? "lg" : "sm"}> 
          <Button variant="outline-danger" onClick={() => onCountChange(Math.max(0, count - 1))} style={isLargeButton ? { fontSize: '2.5rem', height: '160px' } : {}}>-</Button> 
          <Form.Control 
            type="number" 
            value={count} 
            onChange={(e) => onCountChange(parseInt(e.target.value) || 0)} 
            className="text-center fw-bold" 
            style={isLargeButton ? { fontSize: '2.5rem', height: '160px' } : {}}
          />
          <Button variant="outline-success" onClick={() => onCountChange(count + 1)} style={isLargeButton ? { fontSize: '2.5rem', height: '160px' } : {}}>+</Button>
        </InputGroup>
      </Card.Body>
    </Card>
  </Col>
);

const InputForm = forwardRef(({ onUnsavedChangesChange, formData, setFormData, processingDefects, setProcessingDefects, inspectionDefects, setInspectionDefects }, ref) => {
  // --- State管理 ---
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    // formData, processingDefects, inspectionDefects のいずれかが初期値と異なる場合にonUnsavedChangesChangeをtrueにする
    const isFormDataChanged = JSON.stringify(formData) !== JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      line: '',
      worker: '',
      inspector: '',
      customer: '',
      product: '',
      startTime: '',
      endTime: '',
      plannedQuantity: '',
      actualQuantity: '',
      douNomi: '',
      sokoNomi: '',
      notes: ''
    });
    const isProcessingDefectsChanged = JSON.stringify(processingDefects) !== JSON.stringify({
      douInsatsu: 0, douKizu: 0, douSonota: 0, sokoFuryo: 0, futaFuryo: 0
    });
    const isInspectionDefectsChanged = JSON.stringify(inspectionDefects) !== JSON.stringify({
      douInsatsu: 0, douKizu: 0, sokoKizuHekomi: 0, sokoMaki: 0, sonota: 0
    });
    onUnsavedChangesChange(isFormDataChanged || isProcessingDefectsChanged || isInspectionDefectsChanged);
  }, [formData, processingDefects, inspectionDefects, onUnsavedChangesChange]);

  // --- 当日使用数の計算 ---
  const totalInspectionDefects = Object.values(inspectionDefects).reduce((sum, current) => sum + current, 0);
  const totalDou = parseInt(formData.actualQuantity || 0) + parseInt(formData.douNomi || 0) + processingDefects.douInsatsu + processingDefects.douKizu + processingDefects.douSonota + totalInspectionDefects;
  const totalSoko = parseInt(formData.actualQuantity || 0) + parseInt(formData.sokoNomi || 0) + processingDefects.sokoFuryo + totalInspectionDefects;
  const totalFuta = parseInt(formData.actualQuantity || 0) + processingDefects.futaFuryo;

  // --- ハンドラ関数 ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeClick = (field) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setFormData(prev => ({ ...prev, [field]: `${hours}:${minutes}` }));
  };

  const handleProcessingDefectChange = (key, value) => {
    setProcessingDefects(prev => ({ ...prev, [key]: value }));
  };

  const handleInspectionDefectChange = (key, value) => {
    setInspectionDefects(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectComplete = (customer, product, line) => {
    setFormData(prev => ({ ...prev, customer, product, line }));
    setShowCustomerModal(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!formData.customer || !formData.product) {
      alert('顧客名と商品名を入力してください。');
      return false;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (formData.date !== today) {
      alert('日付が今日の日付ではありません。今日の日付を選択してください。');
      return false;
    }

    const submissionData = { 
      ...formData, 
      endTime: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      processingDefects, 
      inspectionDefects
    };
    console.log(submissionData);
    alert('データが保存されました（コンソールに出力）');
    onUnsavedChangesChange(false); // 保存後に変更フラグをリセット
    // ここでFirebaseにデータを送信する処理を実装
    return true; // 保存成功
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit
  }));

  // --- レンダリング ---
  return (
    <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
      {/* 最上層: ライン, 顧客名, 商品名, 日付 */}
      <Row className="g-2 mb-1">
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label className="mb-0">ライン</Form.Label>
            <Form.Control type="text" name="line" value={formData.line} readOnly size="lg" />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label className="mb-0">顧客名</Form.Label>
            <Button variant="outline-secondary" className="w-100 text-start" size="lg" onClick={() => setShowCustomerModal(true)}>
              {formData.customer || '顧客を選択してください'}
            </Button>
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label className="mb-0">商品名</Form.Label>
            <Form.Control type="text" name="product" value={formData.product} readOnly size="lg" />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label className="mb-0">日付</Form.Label>
            <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} size="lg" />
          </Form.Group>
        </Col>
      </Row>

      {/* 第二層: 先頭員, 検査員, 開始時間, 終了時間 */}
      <Row className="g-2 mb-1">
        <Col xs={12} sm={6} md={3}>
          <Form.Group>
            <Form.Label className="mb-0 small">先頭員</Form.Label>
            <Form.Select name="worker" value={formData.worker} onChange={handleChange} size="sm" className="select-large-options">
              {workers.map(w => <option key={w} value={w}>{w}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Form.Group>
            <Form.Label className="mb-0 small">検査員</Form.Label>
            <Form.Select name="inspector" value={formData.inspector} onChange={handleChange} size="sm" className="select-large-options">
              {inspectors.map(i => <option key={i} value={i}>{i}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={6} sm={3} md={3}>
          <Form.Group>
            <Form.Label className="mb-0 small">開始時刻</Form.Label>
            <InputGroup size="sm">
              <Form.Control type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
              <Button variant="outline-secondary" onClick={() => handleTimeClick('startTime')}>現時刻</Button>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* 第三層: 胴のみ, 底のみ, 加工不良 */}
      <Row className="g-2 mb-1"> 
        <Col xs={12} md={2} className="d-flex flex-column"> 
          <Card className="shadow-sm flex-grow-1 mb-0"> 
            <Card.Header className="bg-secondary text-white py-1">型替え調整数</Card.Header> 
            <Card.Body className="py-1 d-flex flex-column justify-content-start"> 
              <Form.Group className="mb-0"> 
                <Form.Label className="mb-0">胴のみ</Form.Label>
                <Form.Control type="number" name="douNomi" placeholder="0" value={formData.douNomi} onChange={handleChange} size="sm" /> 
              </Form.Group>
              <Form.Group className="mb-0"> 
                <Form.Label className="mb-0">底のみ</Form.Label>
                <Form.Control type="number" name="sokoNomi" placeholder="0" value={formData.sokoNomi} onChange={handleChange} size="sm" /> 
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={10} className="d-flex flex-column"> 
          <Card className="shadow-sm flex-grow-1 mb-0"> 
            <Card.Header className="bg-info text-white py-1">加工不良</Card.Header> 
            <Card.Body className="py-1 d-flex flex-column justify-content-around"> {/* py-1に変更, justify-content-aroundを追加 */}
              <Row className="g-1 justify-content-between flex-grow-1 align-items-center"> {/* g-1に変更, flex-grow-1, align-items-centerを追加 */}
                <DefectCounter label="胴印刷" count={processingDefects.douInsatsu} onCountChange={(v) => handleProcessingDefectChange('douInsatsu', v)} />
                <DefectCounter label="胴キズ" count={processingDefects.douKizu} onCountChange={(v) => handleProcessingDefectChange('douKizu', v)} />
                <DefectCounter label="胴その他" count={processingDefects.douSonota} onCountChange={(v) => handleProcessingDefectChange('douSonota', v)} />
                <DefectCounter label="底不良" count={processingDefects.sokoFuryo} onCountChange={(v) => handleProcessingDefectChange('sokoFuryo', v)} />
                <DefectCounter label="蓋不良" count={processingDefects.futaFuryo} onCountChange={(v) => handleProcessingDefectChange('futaFuryo', v)} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 第四層: 検査不良 */}
      <Row className="g-2 mb-1 flex-grow-1"> 
        <Col xs={12} className="d-flex flex-column">
          <Card className="shadow-sm flex-grow-1"> 
            <Card.Header className="bg-info text-white py-1">検査不良 (胴+底)</Card.Header> 
            <Card.Body className="py-1 d-flex flex-column justify-content-around"> 
              <Row className="g-1 justify-content-around flex-grow-1 align-items-center"> 
                <DefectCounter label="胴印刷" count={inspectionDefects.douInsatsu} onCountChange={(v) => handleInspectionDefectChange('douInsatsu', v)} isLargeButton={true} />
                <DefectCounter label="胴キズ" count={inspectionDefects.douKizu} onCountChange={(v) => handleInspectionDefectChange('douKizu', v)} isLargeButton={true} />
                <DefectCounter label="底キズ凹" count={inspectionDefects.sokoKizuHekomi} onCountChange={(v) => handleInspectionDefectChange('sokoKizuHekomi', v)} isLargeButton={true} />
                <DefectCounter label="底巻き" count={inspectionDefects.sokoMaki} onCountChange={(v) => handleInspectionDefectChange('sokoMaki', v)} isLargeButton={true} />
                <DefectCounter label="その他" count={inspectionDefects.sonota} onCountChange={(v) => handleInspectionDefectChange('sonota', v)} isLargeButton={true} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 備考・数量・当日使用数・保存ボタン */}
      <Row className="g-3 align-items-stretch">
        <Col xs={12} md={3}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-secondary text-white py-2">備考</Card.Header>
            <Card.Body className="p-0 h-100">
              <Form.Control
                as="textarea"
                name="notes"
                placeholder="不良やトラブル内容を記入"
                value={formData.notes}
                onChange={handleChange}
                className="h-100 w-100 border-0"
                style={{ resize: 'none' }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-secondary text-white py-2">数量</Card.Header>
            <Card.Body className="py-2 d-flex flex-column justify-content-center">
              <Form.Group as={Row} className="mb-2 align-items-center">
                <Form.Label column sm={5} className="text-end">予定数</Form.Label>
                <Col sm={7}><Form.Control type="number" name="plannedQuantity" placeholder="0" value={formData.plannedQuantity} onChange={handleChange} size="lg" /></Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2 align-items-center">
                <Form.Label column sm={5} className="text-end">生産数</Form.Label>
                <Col sm={7}><Form.Control type="number" name="actualQuantity" placeholder="0" value={formData.actualQuantity} onChange={handleChange} size="lg" /></Col>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-secondary text-white py-2">当日使用数</Card.Header>
            <Card.Body className="py-2">
              <Row className="mb-2 align-items-center">
                <Form.Label column sm={5} className="text-end fw-bold">胴:</Form.Label>
                <Col sm={7}><span className="fs-5">{totalDou} 缶</span></Col>
              </Row>
              <Row className="mb-2 align-items-center">
                <Form.Label column sm={5} className="text-end fw-bold">底:</Form.Label>
                <Col sm={7}><span className="fs-5">{totalSoko} 缶</span></Col>
              </Row>
              <Row className="mb-2 align-items-center">
                <Form.Label column sm={5} className="text-end fw-bold">蓋:</Form.Label>
                <Col sm={7}><span className="fs-5">{totalFuta} 缶</span></Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3} className="d-flex align-items-center justify-content-center">
          <img src="/rogo.ico" alt="ロゴ" style={{ maxWidth: '100%', maxHeight: '120px' }} />
        </Col>
      </Row>

      {/* 顧客選択モーダル */}
      <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>顧客・商品の選択</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '600px' }}>
          <CustomerSelect onSelectComplete={handleSelectComplete} />
        </Modal.Body>
      </Modal>
    </Form>
  );
});

export default InputForm;