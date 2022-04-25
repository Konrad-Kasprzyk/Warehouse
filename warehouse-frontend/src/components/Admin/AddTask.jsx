import React, { useState } from 'react';
import { Button, Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { HallAPI } from '../../api/hall.api';
import { TaskAPI } from '../../api/task.api';
import { updateHall } from '../../features/halls';

function AddTask() {
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const dispatch = useDispatch();
  const [hall, setHall] = useState(null);
  const [startingShelf, setStartingShelf] = useState(null);
  const [destinationShelf, setDestinationShelf] = useState(null);
  const [scanCount, setScanCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  function displayModal(err, title) {
    setModalTitle(title);
    setModalMessage(err instanceof Error ? err.message : err);
    setShowModal(!showModal);
  }

  function renderHallsDropdownMenu() {
    return (
      <Dropdown.Menu>
        {halls.map((hall) => (
          <Dropdown.Item
            key={hall.id}
            onClick={() => {
              setHall(hall);
              setStartingShelf(null);
              setDestinationShelf(null);
            }}
          >
            {hall.Number}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    );
  }

  function renderStartingShelvesDropdownMenu() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          "Select starting shelf"
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {hall.Shelves.filter(
            (shelf) =>
              shelf.ShelfPurpose != 'Shipment' &&
              shelf.ProductModelPartNumber &&
              shelf.ProductModelBrand &&
              shelf.ProductGtins.length > 0,
          ).map((shelf) => (
            <Dropdown.Item
              key={shelf.id}
              onClick={() => setStartingShelf(shelf)}
            >
              <div>
                {shelf.ShelfPurpose} shelf number {shelf.Number}
              </div>
              <div>Product model brand: {shelf.ProductModelBrand}</div>
              <div>
                Product model part number: {shelf.ProductModelPartNumber}
              </div>
              <div>
                Products: {shelf.ProductGtins ? shelf.ProductGtins.length : 0}{' '}
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        <div className="pt-2">{startingShelf ? startingShelf.Number : ''}</div>
      </Dropdown>
    );
  }

  function renderDestinationShelvesDropdownMenu() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          "Select destination shelf"
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {hall.Shelves.filter((shelf) => shelf.ShelfPurpose != 'Delivery').map(
            (shelf) => (
              <Dropdown.Item
                key={shelf.id}
                onClick={() => setDestinationShelf(shelf)}
              >
                <div>
                  {shelf.ShelfPurpose} shelf number {shelf.Number}{' '}
                </div>
                {shelf.ProductModelBrand ? (
                  <>
                    <div>Product model brand: {shelf.ProductModelBrand}</div>
                    <div>
                      Product model part number: {shelf.ProductModelPartNumber}
                    </div>
                  </>
                ) : (
                  'No product model'
                )}
                <div>
                  Products: {shelf.ProductGtins ? shelf.ProductGtins.length : 0}{' '}
                </div>
              </Dropdown.Item>
            ),
          )}
        </Dropdown.Menu>
        <div className="pt-2">
          {destinationShelf ? destinationShelf.Number : ''}
        </div>
      </Dropdown>
    );
  }

  async function createTask() {
    try {
      if (!hall) throw new Error('Choose hall');
      if (!startingShelf) throw new Error('Choose starting shelf');
      if (!destinationShelf) throw new Error('Choose destination shelf');
      if (startingShelf.ShelfPurpose == destinationShelf.ShelfPurpose)
        throw new Error('Both shelves have storage type');
      if (
        destinationShelf.ProductModelPartNumber &&
        (startingShelf.ProductModelPartNumber !=
          destinationShelf.ProductModelPartNumber ||
          startingShelf.ProductModelBrand != destinationShelf.ProductModelBrand)
      )
        throw new Error(
          'Destination shelf has different product model than starting shelf',
        );
      if (scanCount < 1)
        throw new Error("Required scans count can't be below one");
      await TaskAPI.add(
        hall.Number,
        startingShelf.Gtin,
        destinationShelf.Gtin,
        scanCount,
      );
      const newHall = await HallAPI.get(hall.Number);
      dispatch(updateHall(newHall));
      displayModal(
        `Task from shelf number ${startingShelf.Number} to shelf number ${destinationShelf.Number} added.`,
        'Task added',
      );
    } catch (err) {
      displayModal(err, 'Task not added');
    }
  }

  return (
    <Container>
      <Row className="p-2 mx-auto">
        <Col>
          <div className="text-center">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select hall number
              </Dropdown.Toggle>

              {renderHallsDropdownMenu()}
            </Dropdown>
            <div className="pt-2">{hall ? hall.Number : ''}</div>
          </div>
        </Col>
        <Col>
          <label>Please specify required scans:</label> <div></div>
          <input
            value={scanCount}
            onInput={(e) => {
              // @ts-ignore
              setScanCount(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Row className="pt-2">
        <Col className="mb-3">
          {hall ? renderStartingShelvesDropdownMenu() : ''}
        </Col>
        <Col>{hall ? renderDestinationShelvesDropdownMenu() : ''}</Col>
      </Row>
      <Row className="pt-2">
        <Col>
          <Button variant="success" onClick={() => createTask()}>
            Add task
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
export default AddTask;
