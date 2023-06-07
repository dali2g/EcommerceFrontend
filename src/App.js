import React, { useEffect, useState } from 'react';
import api from './api';
import './App.css';
import { Container, Form, Button } from 'react-bootstrap';
import { Row, Col, Card } from 'react-bootstrap';

function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState([]);

  useEffect(() => {
    // Make a GET request to retrieve the first page of products from the server
    api.get(`http://localhost:5000/products?page=${currentPage}&limit=10`)
      .then(response => {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        window.scrollTo(0, 0); // Scroll to top of page when new products are loaded
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const regex = new RegExp(searchTerm, 'i');
    return regex.test(product.name) || regex.test(product.category);
  });

  // Navigate to the product link when the button is clicked
  const handleProductClick = (productLink) => {
    window.location.href = productLink;
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="home" style={{ fontFamily: 'Pacifico', fontSize: '2rem' }}>Meilleur Choix</a>
          <Form className="mx-auto d-flex">
            <Form.Control type="text" placeholder="Search for products" onChange={handleSearch} />
          </Form>
        </div>
      </nav>

      <Container>
        <Row xs={1} md={2} lg={3} className="g-4 mt-3">
          {filteredProducts.map(product => (
            <Col key={product._id}>
              <Card className="h-100">
                <Card.Img variant="top" src={product.image} alt={product.name + ' product'} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Card.Text>Price: <span style={{ fontWeight: 'bold' }}>{product.price}</span></Card.Text>
                  <Button variant="success" onClick={() => handleProductClick(product.link)}>View Product</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-center mt-3">
          {currentPage > 1 && (
            <Button variant="secondary" className="me-2" onClick={handlePrevPage}>Prev</Button>
          )}
          {currentPage < totalPages && (
            <Button variant="secondary" onClick={handleNextPage}>Next</Button>
          )}
        </div>
      </Container>
    </div>
  );
}

export default App;
