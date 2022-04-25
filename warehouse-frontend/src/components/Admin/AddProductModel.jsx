import React, { useState } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { ProductModelAPI } from '../../api/productModel.api';

function AddProductModel() {
  // @ts-ignore
  const [productModelName, setProductModelName] = useState('');
  const [productModelBrand, setProductModelBrand] = useState('');
  const [productModelPartNumber, setProductModelPartNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  function displayModal(err, title) {
    setModalTitle(title);
    setModalMessage(err instanceof Error ? err.message : err);
    setShowModal(!showModal);
  }

  async function addProductModel() {
    try {
      if (!productModelName) throw new Error('Please enter product model name');
      if (!productModelBrand)
        throw new Error('Please enter product model brand');
      if (!productModelPartNumber)
        throw new Error('Please enter product model part number');
      await ProductModelAPI.add(
        productModelName,
        productModelBrand,
        productModelPartNumber,
      );
      displayModal(
        `Product model ${productModelName} added.`,
        'Product model added',
      );
    } catch (err) {
      displayModal(err, 'Product model not added');
    }
  }

  return (
    <Container>
      <Row className="m-4">
        <Col>
          <label>Please specify product model name:</label> <div></div>
          <input
            value={productModelName}
            onInput={(e) =>
              // @ts-ignore
              setProductModelName(e.target.value)
            }
          />
        </Col>
      </Row>
      <Row className="m-4">
        <Col>
          <label>Please specify product model brand:</label> <div></div>
          <input
            value={productModelBrand}
            onInput={(e) =>
              // @ts-ignore
              setProductModelBrand(e.target.value)
            }
          />
        </Col>
      </Row>
      <Row className="m-4">
        <Col>
          <label>Please specify product model part number:</label> <div></div>
          <input
            value={productModelPartNumber}
            onInput={(e) =>
              // @ts-ignore
              setProductModelPartNumber(e.target.value)
            }
          />
        </Col>
      </Row>
      <Row className="m-4">
        <Col>
          <Button variant="success" onClick={() => addProductModel()}>
            Add product model
          </Button>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(!showModal)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>
    </Container>
  );
}
export default AddProductModel;
