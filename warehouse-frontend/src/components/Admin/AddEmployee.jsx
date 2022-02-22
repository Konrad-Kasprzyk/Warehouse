import React, { useState } from "react";
import { Button, Col, Container, Dropdown, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { EmployeeAPI } from "../../api/employee.api";

function AddEmployee() {
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const [hallNumber, setHallNumber] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

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

  async function addEmployee() {
    try {
      if (!hallNumber) throw new Error("Choose hall");
      if (!role) throw new Error("Choose employee role");
      if (!name) throw new Error("Please enter name");
      if (!surname) throw new Error("Please enter surname");
      await EmployeeAPI.add(hallNumber, role, name, surname);
      displayModal(`${role} ${name} ${surname} added.`, "Employee added");
    } catch (err) {
      displayModal(err, "Employee not added");
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
            <div className="pt-2">{hallNumber}</div>
          </div>
        </Col>
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select Role
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setRole("Employee")}>Employee</Dropdown.Item>
              <Dropdown.Item onClick={() => setRole("Manager")}>Manager</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {role}
        </Col>
      </Row>
      <Row className="pt-2">
        <Col>
          <label>Name:</label> <div></div>
          <input
            value={name}
            onInput={(e) => {
              // @ts-ignore
              setName(e.target.value);
            }}
          />
        </Col>
        <Col>
          <label>Surname:</label> <div></div>
          <input
            value={surname}
            onInput={(e) => {
              // @ts-ignore
              setSurname(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button variant="success" onClick={() => addEmployee()}>
            Add employee
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
export default AddEmployee;
