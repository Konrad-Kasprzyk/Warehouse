import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Dropdown, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { HallAPI } from "../../api/hall.api";
import { addHall, updateHall } from "../../features/halls";
import { v4 as uuidv4 } from "uuid";
import { ShelfAPI } from "../../api/shelf.api";

function AddHallOrShelf() {
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const dispatch = useDispatch();
  const [hallNumber, setHallNumber] = useState(null);
  const [shelfPurpose, setShelfPurpose] = useState("");
  const nextHallNumber = useRef(0);
  const nextShelfNumber = useRef(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (halls.length == 0) return;
    let highestHallNumber = 0;
    let highestShelfNumber = 0;
    halls.forEach((hall) => {
      if (highestHallNumber < hall.Number) highestHallNumber = hall.Number;
      hall.Shelves.forEach((shelf) => {
        if (highestShelfNumber < shelf.Number) highestShelfNumber = shelf.Number;
      });
    });
    if (highestHallNumber >= nextHallNumber.current) {
      nextHallNumber.current = highestHallNumber;
      nextHallNumber.current++;
    }
    if (highestShelfNumber >= nextShelfNumber.current) {
      nextShelfNumber.current = highestShelfNumber;
      nextShelfNumber.current++;
    }
  }, [halls]);

  function displayModal(err, title) {
    setModalTitle(title);
    setModalMessage(err instanceof Error ? err.message : err);
    setShowModal(!showModal);
  }

  function renderHallsDropdownMenu() {
    return (
      <Dropdown.Menu>
        {halls.map((hall) => (
          <Dropdown.Item key={hall.id} onClick={() => setHallNumber(hall.Number)}>
            {hall.Number}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    );
  }

  async function addNewHall() {
    try {
      const newHall = await HallAPI.add(nextHallNumber.current);
      displayModal(`Hall number ${nextHallNumber.current} added.`, "Hall added");
      nextHallNumber.current++;
      dispatch(addHall(newHall));
    } catch (err) {
      displayModal(err, "Hall not added");
    }
  }

  async function addShelf() {
    try {
      if (!hallNumber) throw new Error("Choose hall");
      if (!shelfPurpose) throw new Error("Choose shelf purpose");
      const shelfGtin = uuidv4();
      await ShelfAPI.add(hallNumber, nextShelfNumber.current, shelfGtin, shelfPurpose);
      displayModal(`${shelfPurpose} shelf number ${nextShelfNumber.current} added.`, "Shelf added");
      nextShelfNumber.current++;
      const newHall = await HallAPI.get(hallNumber);
      dispatch(updateHall(newHall));
    } catch (err) {
      displayModal(err, "Shelf not added");
    }
  }

  return (
    <Container>
      <Row className="m-3">
        <Col>
          <Button variant="success" onClick={() => addNewHall()}>
            Add hall
          </Button>
        </Col>
      </Row>
      <Row className="p-2 mx-auto">
        <Col className="mb-2">
          <div className="text-center">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select hall number
              </Dropdown.Toggle>

              {renderHallsDropdownMenu()}
            </Dropdown>
            <div className="pt-1">{hallNumber}</div>
          </div>
        </Col>
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select shelf purpose
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShelfPurpose("Delivery")}>Delivery</Dropdown.Item>
              <Dropdown.Item onClick={() => setShelfPurpose("Storage")}>Storage</Dropdown.Item>
              <Dropdown.Item onClick={() => setShelfPurpose("Shipment")}>Shipment</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="pt-1">{shelfPurpose}</div>
        </Col>
      </Row>
      <Row className="pt-2">
        <Col>
          <Button variant="success" onClick={() => addShelf()}>
            Add shelf
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
export default AddHallOrShelf;
