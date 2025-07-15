import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';

function Dashboard() {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">ダッシュボード</h1>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <div className="d-grid gap-3">
            <Link to="/input">
              <Button variant="primary" size="lg" className="w-100">
                生産データを入力する
              </Button>
            </Link>
            <Link to="/customer-select">
              <Button variant="info" size="lg" className="w-100">
                顧客・商品を選択する
              </Button>
            </Link>
            {/* 他の機能へのリンクをここに追加予定 */}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
