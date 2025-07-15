import React from 'react';
import { Container, Card } from 'react-bootstrap';

function KakuhoPage({ pageName }) {
  return (
    <Container className="mt-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">{pageName}</Card.Header>
        <Card.Body>
          <p>ここに{pageName}の内容が表示されます。</p>
          <p>（現在開発中）</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default KakuhoPage;
