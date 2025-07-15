import React from 'react';
import { Container, Card, ListGroup, Button } from 'react-bootstrap';

function TopPage() {
  // ダミーデータ
  const dailyRecords = [
    { id: 1, customer: 'あいだ産業', product: '部品1', quantity: 1200 },
    { id: 2, customer: '自社', product: 'バニラ', quantity: 5000 },
    { id: 3, customer: 'かとう金属', product: '製品A', quantity: 800 },
  ];

  const handleRefresh = () => {
    alert('データを更新しました（実際にはまだ同期機能はありません）');
    // ここにデータ更新ロジックを実装
  };

  return (
    <Container className="mt-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">当日の生産実績</h5>
          <Button variant="light" size="sm" onClick={handleRefresh}>更新</Button>
        </Card.Header>
        <ListGroup variant="flush">
          {dailyRecords.length > 0 ? (
            dailyRecords.map(record => (
              <ListGroup.Item key={record.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{record.customer}</strong> - {record.product}
                </div>
                <span className="badge bg-success rounded-pill fs-6">{record.quantity} 缶</span>
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
