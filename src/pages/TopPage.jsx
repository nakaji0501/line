import React from 'react';
import { Container, Card, ListGroup, Button, Row, Col } from 'react-bootstrap';

function TopPage() {
  // ダミーデータ
  const dailyRecords = [
    { id: 1, line: 'A', customer: 'あいだ産業', product: '部品1', actualQuantity: 1200, plannedQuantity: 1500 },
    { id: 2, line: 'B', customer: '自社', product: 'バニラ', actualQuantity: 5000, plannedQuantity: 6000 },
    { id: 3, line: 'A', customer: 'かとう金属', product: '製品A', actualQuantity: 800, plannedQuantity: 1000 },
  ].sort((a, b) => b.line.localeCompare(a.line));

  const handleRefresh = () => {
    alert('データを更新しました（実際にはまだ同期機能はありません）');
    // ここにデータ更新ロジックを実装
  };

  return (
    <Container className="mt-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">当日の生産実績</h5>
          <div className="d-flex align-items-center">
            <Button variant="light" size="sm" onClick={handleRefresh}>更新</Button>
          </div>
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex align-items-center bg-light fw-bold">
            <Row className="flex-grow-1 g-0 align-items-start">
              <Col xs={1} className="text-start">ライン</Col>
              <Col xs={3} className="text-start">顧客名</Col>
              <Col xs={2} className="text-start">商品名</Col>
              <Col xs={4} className="text-end">生産数</Col>
              <Col xs={2} className="text-end">
                <span className="badge bg-danger">50%まで</span>
                <span className="badge bg-warning ms-1">80%まで</span>
                <span className="badge bg-primary ms-1">81%以上</span>
              </Col>
            </Row>
          </ListGroup.Item>
          {dailyRecords.length > 0 ? (
            dailyRecords.map(record => (
              <ListGroup.Item key={record.id} className="d-flex align-items-center">
                <Row className="flex-grow-1 g-0 align-items-start">
                  <Col xs={1} className="text-start">{record.line}</Col>
                  <Col xs={3} className="text-start">{record.customer}</Col>
                  <Col xs={2} className="text-start">{record.product}</Col>
                  <Col xs={4} className="text-end">{record.actualQuantity} 缶</Col>
                  <Col xs={2} className="text-end">
                    {(() => {
                      const progress = (record.actualQuantity / record.plannedQuantity) * 100;
                      let badgeClass = 'bg-info';
                      if (progress <= 50) {
                        badgeClass = 'bg-danger';
                      } else if (progress <= 80) {
                        badgeClass = 'bg-warning';
                      } else {
                        badgeClass = 'bg-primary';
                      }
                      return (
                        <span className={`badge ${badgeClass} rounded-pill fs-6`}>
                          進捗率: {progress.toFixed(1)}%
                        </span>
                      );
                    })()}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-muted">まだ生産実績がありません。</ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
}

export default TopPage;
