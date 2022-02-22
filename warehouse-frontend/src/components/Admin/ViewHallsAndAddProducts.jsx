import React, { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { HallAPI } from "../../api/hall.api";
import { ProductAPI } from "../../api/product.api";
import { ProductModelAPI } from "../../api/productModel.api";
import { updateHall } from "../../features/halls";
import { v4 as uuidv4 } from "uuid";

function ViewHallsAndAddProducts() {
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const dispatch = useDispatch();
  const [hall, setHall] = useState(null);
  const [shelf, setShelf] = useState(null);
  const [shelfPurpose, setShelfPurpose] = useState(null);
  const [productModel, setProductModel] = useState(null);
  const [filteredShelves, setFilteredShelves] = useState([]);
  const [productModels, setProductModels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  function displayModal(err, title) {
    setModalTitle(title);
    setModalMessage(err instanceof Error ? err.message : err);
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchProductModels() {
      setProductModels(await ProductModelAPI.getAll());
    }
    fetchProductModels();
  }, []);

  function renderHallsDropdownMenu() {
    return (
      <Dropdown.Menu>
        {halls.map((hall) => (
          <Dropdown.Item
            key={hall.id}
            onClick={() => {
              setHall(hall);
              setFilteredShelves(hall.Shelves);
              setShelf(null);
              setShelfPurpose("");
              setProductModel(null);
            }}
          >
            {hall.Number}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    );
  }

  function renderProductModelsDropdownMenu() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select product model
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {productModels.map((productModel) => (
            <Dropdown.Item key={productModel.id} onClick={() => setProductModel(productModel)}>
              <div>{productModel.Brand}</div>
              <div>{productModel.PartNumber}</div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        <div className="pt-2">{productModel ? productModel.Brand : ""}</div>
        <div>{productModel ? productModel.PartNumber : ""}</div>
      </Dropdown>
    );
  }

  function renderShelvesDropdownMenu() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select shelf
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {filteredShelves.map((shelf) => (
            <Dropdown.Item
              key={shelf.id}
              onClick={() => {
                setShelf(shelf);
                setProductModel(null);
              }}
            >
              <div>
                {shelf.ShelfPurpose} shelf number {shelf.Number}
              </div>
              {shelf.ProductModelBrand ? (
                <>
                  <div>Product model brand: {shelf.ProductModelBrand}</div>
                  <div>Product model part number: {shelf.ProductModelPartNumber}</div>
                </>
              ) : (
                "No product model"
              )}

              <div>Products: {shelf.ProductGtins ? shelf.ProductGtins.length : 0} </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        <div className="pt-2">{shelf ? shelf.Number : ""}</div>
      </Dropdown>
    );
  }

  async function addProduct() {
    try {
      if (!hall) throw new Error("Choose hall");
      if (!shelf) throw new Error("Choose shelf");
      if (!productModel && (!shelf.ProductModelPartNumber || !shelf.ProductModelBrand))
        throw new Error(
          "Chosen shelf doesn't have product model assigned and product model was not chosen."
        );
      let productModelId = productModel ? productModel.id : null;
      if (!productModelId)
        productModelId = productModels.find(
          (productModel) =>
            productModel.PartNumber == shelf.ProductModelPartNumber &&
            productModel.Brand == shelf.ProductModelBrand
        ).id;
      await ProductAPI.add(hall.Number, shelf.Gtin, productModelId, uuidv4());
      const updatedHall = await HallAPI.get(hall.Number);
      dispatch(updateHall(updatedHall));
      setHall(updatedHall);
      const updatedShelf = updatedHall.Shelves.find((updatedShelf) => updatedShelf.id == shelf.id);
      setShelf(updatedShelf);
      const index = filteredShelves.findIndex((shelf) => shelf.id == updatedShelf.id);
      const newFilteredShelves = JSON.parse(JSON.stringify(filteredShelves));
      newFilteredShelves[index] = updatedShelf;
      setFilteredShelves(newFilteredShelves);
      displayModal(
        `Product added to ${updatedShelf.ShelfPurpose} shelf number ${updatedShelf.Number}.`,
        "Product added"
      );
    } catch (err) {
      displayModal(err, "Product not added");
    }
  }

  return (
    <Container>
      <Row className="p-3 mx-auto">
        <Col>
          <div className="text-center">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select hall number
              </Dropdown.Toggle>

              {renderHallsDropdownMenu()}
            </Dropdown>
            <div className="pt-2">{hall ? hall.Number : ""}</div>
          </div>
        </Col>
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select shelf purpose
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setFilteredShelves(
                    hall.Shelves.filter((shelf) => shelf.ShelfPurpose == "Delivery")
                  );
                  setShelf(null);
                  setProductModel(null);
                  setShelfPurpose("Delivery");
                }}
              >
                Delivery
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFilteredShelves(
                    hall.Shelves.filter((shelf) => shelf.ShelfPurpose == "Storage")
                  );
                  setShelf(null);
                  setProductModel(null);
                  setShelfPurpose("Storage");
                }}
              >
                Storage
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFilteredShelves(
                    hall.Shelves.filter((shelf) => shelf.ShelfPurpose == "Shipment")
                  );
                  setShelf(null);
                  setProductModel(null);
                  setShelfPurpose("Shipment");
                }}
              >
                Shipment
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFilteredShelves(hall.Shelves);
                  setShelf(null);
                  setProductModel(null);
                  setShelfPurpose("");
                }}
              >
                Clear
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="pt-1">{shelfPurpose}</div>
        </Col>
      </Row>
      {!hall ? <div>Please choose hall to view shelves.</div> : ""}
      <Row>
        <Col>{hall ? renderShelvesDropdownMenu() : ""}</Col>
        <Col> {shelf && !shelf.ProductModelBrand ? renderProductModelsDropdownMenu() : ""}</Col>
      </Row>
      <Row className="mt-3">
        <Col>
          {shelf && (shelf.ProductModelBrand || productModel) ? (
            <Button variant="success" onClick={() => addProduct()}>
              Add product
            </Button>
          ) : (
            ""
          )}
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
export default ViewHallsAndAddProducts;
