import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';

const hiraganaRows = [
  ['わ', 'ら', 'や', 'ま', 'は', 'な', 'た', 'さ', 'か', 'あ'],
  [null, 'り', null, 'み', 'ひ', 'に', 'ち', 'し', 'き', 'い'],
  [null, 'る', 'ゆ', 'む', 'ふ', 'ぬ', 'つ', 'す', 'く', 'う'],
  [null, 'れ', null, 'め', 'へ', 'ね', 'て', 'せ', 'け', 'え'],
  ['を', 'ろ', 'よ', 'も', 'ほ', 'の', 'と', 'そ', 'こ', 'お']
];

function CustomerSelect({ onSelectComplete }) {
  const [productsData, setProductsData] = useState([]);
  const [customersByChar, setCustomersByChar] = useState({});
  const [fittingTypes, setFittingTypes] = useState([]);

  useEffect(() => {
    fetch('/master_data.json')
      .then(response => response.json())
      .then(data => {
        setFittingTypes(data.fittingTypes);
        setProductsData(data.productsData);

        const newCustomersByChar = {};
        data.productsData.forEach(item => {
          const kanaChar = item.かな;
          if (kanaChar) {
            if (!newCustomersByChar[kanaChar]) {
              newCustomersByChar[kanaChar] = [];
            }
            // 重複を避けるため、顧客名がまだ追加されていなければ追加
            if (!newCustomersByChar[kanaChar].includes(item.お客様)) {
              newCustomersByChar[kanaChar].push(item.お客様);
            }
          }
        });
        setCustomersByChar(newCustomersByChar);
      })
      .catch(error => console.error("Error loading master data:", error));
  }, []);

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
    const line = productsData.find(item => item.お客様 === selectedCustomer && item.商品名 === product)?.ライン || '';
    onSelectComplete(selectedCustomer, product, line);
  };

  const currentCustomers = customersByChar[selectedChar] || [];
  const currentProducts = selectedCustomer 
    ? productsData.filter(item => item.お客様 === selectedCustomer).map(item => item.商品名) 
    : [];

  return (
    <Container fluid>
      <Row className="mb-3 flex-nowrap">
        <Col xs="auto">
          <h5 className="text-center">頭文字で絞り込み</h5>
          {/* ひらがな表のレイアウト調整 */}
          <div className="d-flex flex-column align-items-center">
            {hiraganaRows.map((row, rowIndex) => (
              <div key={rowIndex} className="d-flex justify-content-center">
                {row.map((char, colIndex) => (
                  char ? (
                    <Button 
                      key={`${rowIndex}-${colIndex}`}
                      variant={selectedChar === char ? "primary" : "outline-secondary"} 
                      onClick={() => { setSelectedChar(char); setSelectedCustomer(null); setSelectedProduct(null); }} 
                      className="m-1 p-3 fs-5" 
                      style={{ minWidth: '60px' }} // ボタンの最小幅を確保
                    >
                      {char}
                    </Button>
                  ) : (
                    <div key={`${rowIndex}-${colIndex}`} className="m-1 p-3 fs-5" style={{ minWidth: '60px', visibility: 'hidden' }}></div>
                  )
                ))}
              </div>
            ))}
            <Button 
              key="jisha-button" 
              variant={selectedChar === '自' ? "primary" : "outline-secondary"} 
              onClick={() => { setSelectedChar('自'); setSelectedCustomer(null); setSelectedProduct(null); }} 
              className="m-1 p-3 fs-5" 
              style={{ minWidth: '60px' }} // ボタンの最小幅を確保
            >
              自社
            </Button>
          </div>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-info text-white">顧客リスト</Card.Header>
            <ListGroup variant="flush" className="flex-grow-1" style={{ overflowY: 'auto' }}>
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
            <ListGroup variant="flush" className="flex-grow-1" style={{ overflowY: 'auto' }}>
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