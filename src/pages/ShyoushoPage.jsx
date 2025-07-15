import React from 'react';
import { Container, Card } from 'react-bootstrap';

function ShyoushoPage() {
  return (
    <Container className="mt-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">仕様書</Card.Header>
        <Card.Body>
          <p>ここに仕様書の内容が表示されます。</p>
          <p>（現在開発中）</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ShyoushoPage;
