import React, { useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';

// --- マスターデータ（仮）---
// 顧客、商品、ラインの紐付け
const masterData = {
  'あいだ産業': { products: ['部品1', '部品2', '部品3', '部品4'], line: 'Aライン' },
  'あおき工業': { products: ['製品X', '製品Y'], line: 'Bライン' },
  'あさの製作所': { products: ['パーツA', 'パーツB'], line: 'Cライン' },
  'いとう商事': { products: ['商品101', '商品102'], line: 'Dライン' },
  '自社': { products: ['バニラ', 'ミルク', 'ブラック', 'イエロー', 'ストロベリー', 'チョコレート'], line: '自社ライン' },
  'さとう精機': { products: ['商品X', '商品Y', '商品Z', '商品A', '商品B'], line: 'Eライン' },
  'かとう金属': { products: ['製品A', '製品B', '製品C'], line: 'Fライン' }
};

// ひらがなごとの顧客リスト
const customersByChar = {
  'あ': ['あいだ産業', 'あおき工業', 'あさの製作所'],
  'い': ['いとう商事'],
  'か': ['かとう金属'],
  'さ': ['さとう精機'],
  '自': ['自社']
  // 他のひらがなやA-Z, 0-9も同様に追加
};

const hiraganaRows = [
  ['あ', 'い', 'う', 'え', 'お'], ['か', 'き', 'く', 'け', 'こ'], ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'], ['な', 'に', 'ぬ', 'ね', 'の'], ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'], ['や', 'ゆ', 'よ'], ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', 'を', 'ん'], ['A-Z', '0-9', '自']
];

function CustomerSelect({ onSelectComplete }) {
  const [selectedChar, setSelectedChar] = useState('あ');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedProduct(null); // 顧客が変わったら商品はリセット
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    // 商品が選択された時点で確定
    const line = masterData[selectedCustomer]?.line || '';
    onSelectComplete(selectedCustomer, product, line);
  };

  const currentCustomers = customersByChar[selectedChar] || [];
  const currentProducts = selectedCustomer ? (masterData[selectedCustomer]?.products || []) : [];

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h5 className="text-center">頭文字で絞り込み</h5>
          {/* ひらがな表のレイアウト調整 */}
          <div className="d-flex flex-wrap justify-content-center">
            {hiraganaRows.flat().map(char => (
              <Button 
                key={char} 
                variant={selectedChar === char ? "primary" : "outline-secondary"} 
                onClick={() => setSelectedChar(char)} 
                className="m-1 p-3 fs-5" 
                style={{ minWidth: '60px' }} // ボタンの最小幅を確保
              >
                {char}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-info text-white">顧客リスト</Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {currentCustomers.length > 0 ? (
                currentCustomers.map(customer => (
                  <ListGroup.Item 
                    key={customer} 
                    action 
                    active={selectedCustomer === customer}
                    onClick={() => handleCustomerClick(customer)}
                    className="py-3 fs-5"
                  >
                    {customer}
                  </ListGroup.Item>
                ))
              ) : <ListGroup.Item className="text-muted py-3">該当なし</ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-info text-white">商品リスト</Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <ListGroup.Item 
                    key={product}
                    action
                    active={selectedProduct === product}
                    onClick={() => handleProductClick(product)}
                    className="py-3 fs-5"
                  >
                    {product}
                  </ListGroup.Item>
                ))
              ) : <ListGroup.Item className="text-muted py-3">顧客を選択してください</ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CustomerSelect;