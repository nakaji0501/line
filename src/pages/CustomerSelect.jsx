import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';

const hiraganaRows = [
  ['わ', 'ら', 'や', 'ま', 'は', 'な', 'た', 'さ', 'か', 'あ'],
  [null, 'り', null, 'み', 'ひ', 'に', 'ち', 'し', 'き', 'い'],
  [null, 'る', 'ゆ', 'む', 'ふ', 'ぬ', 'つ', 'す', 'く', 'う'],
  [null, 'れ', null, 'め', 'へ', 'ね', 'て', 'せ', 'け', 'え'],
  ['を', 'ろ', 'よ', 'も', 'ほ', 'の', 'と', 'そ', 'こ', 'お']
];

function CustomerSelect({ onSelectComplete }) {
  const productCardRef = useRef(null);
  const [productsData, setProductsData] = useState([]);
  const [customersByChar, setCustomersByChar] = useState({});
  const [selectedJishaModel, setSelectedJishaModel] = useState(null); // 自社製品の型名

  useEffect(() => {
    fetch('/master_data.json')
      .then(response => response.json())
      .then(data => {
        setProductsData(data.productsData);

        const newCustomersByChar = {};
        const jishaModels = new Set(); // 自社製品の型名を収集

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

            // 「自社」製品の型名を収集
            if (item.かな === '自社') {
              jishaModels.add(item.お客様);
            }
          }
        });
        // 「自社」のキーに型名リストを設定
        newCustomersByChar['自社'] = Array.from(jishaModels);
        setCustomersByChar(newCustomersByChar);
      })
      .catch(error => console.error("Error loading master data:", error));
  }, []);

  const [selectedChar, setSelectedChar] = useState('あ');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCustomerClick = (customer) => {
    if (selectedChar === '自社') {
      setSelectedJishaModel(customer);
      setSelectedProduct(null);
    } else {
      setSelectedCustomer(customer);
      setSelectedProduct(null);
      setSelectedJishaModel(null);
    }
    if (productCardRef.current) {
      productCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleProductClick = (product) => {
    if (selectedCustomer === '自社' && !selectedJishaModel) {
      // 「自社」が選択されており、まだ型名が選択されていない場合
      setSelectedJishaModel(product); // クリックされたものを型名として設定
      setSelectedProduct(null);
      return;
    }

    // 最終的な商品が選択された場合
    setSelectedProduct(product);
    let finalCustomer = selectedCustomer;
    let finalProduct = product;
    let line = '';

    if (selectedCustomer === '自社') {
        // お客様が「自社」の場合、型名（selectedJishaModel）を使って商品データを検索
        const productData = productsData.find(item => item.お客様 === selectedJishaModel && item.商品名 === product);
        line = productData?.ライン || '';
        finalCustomer = '自社'; // フォームに渡す顧客名は「自社」のままにする
    } else {
        const productData = productsData.find(item => item.お客様 === selectedCustomer && item.商品名 === product);
        line = productData?.ライン || '';
    }
    
    onSelectComplete(finalCustomer, finalProduct, line);
  };

  const currentCustomers = (() => {
    if (selectedChar === 'A-Z') {
      const alphabetCustomers = productsData
        .filter(item => /[a-zA-Z]/.test(item.かな))
        .map(item => item.お客様);
      return [...new Set(alphabetCustomers)];
    }
    return customersByChar[selectedChar] || [];
  })();

  const currentProducts = (() => {
    if (!selectedCustomer) return [];
    if (selectedCustomer === '自社') {
      if (!selectedJishaModel) {
        // 「自社」が選択されており、型名がまだ選択されていない場合は型名リストを返す
        return customersByChar['自社'] || [];
      } else {
        // 型名が選択されている場合は、その型名に紐づく最終製品リストを返す
        return productsData.filter(item => item.お客様 === selectedJishaModel).map(item => item.商品名);
      }
    }
    // 通常の顧客選択フロー
    return productsData.filter(item => item.お客様 === selectedCustomer).map(item => item.商品名);
  })();

  return (
    <Container fluid style={{ height: '100%' }}> {/* Modal.Bodyの高さに合わせる */}
      <Row className="flex-nowrap h-100"> {/* Rowも高さを100%にする */}
        <Col xs="auto" className="d-flex flex-column">
          <h5 className="text-center">頭文字で絞り込み</h5>
          <div className="d-flex flex-column align-items-center flex-grow-1 overflow-auto"> {/* ひらがな表のスクロール */}
            {hiraganaRows.map((row, rowIndex) => (
              <div key={rowIndex} className="d-flex justify-content-center">
                {row.map((char, colIndex) => (
                  char ? (
                    <Button 
                      key={`${rowIndex}-${colIndex}`}
                      variant={selectedChar === char ? "primary" : "outline-secondary"} 
                      onClick={() => { setSelectedChar(char); setSelectedCustomer(null); setSelectedProduct(null); setSelectedJishaModel(null); }} 
                      className="m-1 p-3 fs-5" 
                      style={{ minWidth: '60px' }}
                    >
                      {char}
                    </Button>
                  ) : (
                    <div key={`${rowIndex}-${colIndex}`} className="m-1 p-3 fs-5" style={{ minWidth: '60px', visibility: 'hidden' }}></div>
                  )
                ))}
              </div>
            ))}
            <div className="d-flex justify-content-center mt-2">
                <Button 
                  variant={selectedChar === '自社' ? "primary" : "outline-secondary"} 
                  onClick={() => { setSelectedChar('自社'); setSelectedCustomer('自社'); setSelectedProduct(null); setSelectedJishaModel(null); }} 
                  className="m-1 p-3 fs-5" 
                  style={{ minWidth: '60px' }}
                >
                  自社
                </Button>
                <Button 
                  variant={selectedChar === 'A-Z' ? "primary" : "outline-secondary"} 
                  onClick={() => { setSelectedChar('A-Z'); setSelectedCustomer(null); setSelectedProduct(null); setSelectedJishaModel(null); }} 
                  className="m-1 p-3 fs-5" 
                  style={{ minWidth: '60px' }}
                >
                  A-Z
                </Button>
            </div>
          </div>
        </Col>

        <Col className="d-flex flex-column" style={{ width: '30%', flex: '0 0 30%' }}> {/* 幅を固定 */}
          <Card className="shadow-sm d-flex flex-column flex-grow-1">
            <Card.Header className="bg-info text-white">顧客リスト</Card.Header>
            <Card.Body className="p-0 d-flex flex-column flex-grow-1">
            <ListGroup variant="flush" className="flex-grow-1" style={{ height: '100%', overflowY: 'auto' }}>
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
            </Card.Body>
          </Card>
        </Col>

        <Col className="d-flex flex-column" style={{ width: '45%', flex: '0 0 45%' }}> {/* 幅を固定 */}
          <Card ref={productCardRef} className="shadow-sm d-flex flex-column flex-grow-1">
            <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
                <span>
                    {selectedCustomer === '自社' && selectedJishaModel 
                        ? `${selectedJishaModel}の商品` 
                        : '商品リスト'
                    }
                </span>
                {selectedCustomer === '自社' && selectedJishaModel && (
                    <Button variant="light" size="sm" onClick={() => setSelectedJishaModel(null)}>
                        ← 型名選択に戻る
                    </Button>
                )}
            </Card.Header>
            <Card.Body className="p-0 d-flex flex-column flex-grow-1">
            <ListGroup variant="flush" className="flex-grow-1" style={{ height: '100%', overflowY: 'auto' }}>
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
                            ) : <ListGroup.Item className="text-muted py-3">{selectedCustomer ? '商品がありません' : '顧客を選択してください'}</ListGroup.Item>}
            </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CustomerSelect;
