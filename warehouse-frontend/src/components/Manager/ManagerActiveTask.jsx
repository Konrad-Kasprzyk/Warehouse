import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Button, Col, Container, Dropdown, Modal, Row } from "react-bootstrap";
import { TaskAPI } from "../../api/task.api";
import { replaceAllEmployees, updateEmployee } from "../../features/employees";
import { EmployeeAPI } from "../../api/employee.api";
import { updateTask } from "../../features/tasks";
import { updateHall } from "../../features/halls";
import { HallAPI } from "../../api/hall.api";

function ManagerActiveTask(props) {
  const dispatch = useDispatch();
  const [startingShelf, setStartingShelf] = useState(null);
  const [cancelCause, setCancelCause] = useState(null);
  const [destinationShelf, setDestinationShelf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  function displayModal(err) {
    setModalMessage(err instanceof Error ? err.message : err);
    setShowModal(!showModal);
  }

  useEffect(() => {
    const startingShelf = props.hall.Shelves.find(
      (shelf) => shelf.Gtin == props.task.TaskDetails.StartingShelfGtin
    );
    setStartingShelf(startingShelf);
    const destinationShelf = props.hall.Shelves.find(
      (shelf) => shelf.Gtin == props.task.TaskDetails.DestinationShelfGtin
    );
    setDestinationShelf(destinationShelf);
  }, []);

  function renderCancelCausesDropdownMenu() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Choose cancel cause
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setCancelCause("LackOfSpace")}>LackOfSpace</Dropdown.Item>
          <Dropdown.Item onClick={() => setCancelCause("ProductsMissing")}>
            ProductsMissing
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setCancelCause("Other")}>Other</Dropdown.Item>
          <Dropdown.Item onClick={() => setCancelCause(null)}>Clear</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  async function cancelTask() {
    try {
      if (!props.manager) throw new Error("Please choose a manager.");
      if (!cancelCause) throw new Error("Please choose task cancel cause.");
      await TaskAPI.cancelTask(props.employeeId, props.manager.id, cancelCause);
      dispatch(updateEmployee(await EmployeeAPI.get(props.employeeId)));
      dispatch(updateHall(await HallAPI.get(props.hall.Number)));
    } catch (err) {
      displayModal(err);
    }
  }

  function renderCancelTaskButton() {
    return (
      <Button variant="danger" onClick={() => cancelTask()}>
        Cancel task
      </Button>
    );
  }

  return (
    <Container className="square border border-secondary rounded">
      <Row className="p-1">
        <Col md className="pb-1">
          <div>Task Active</div>
          <div>Queue date: {props.task.QueueTime}</div>
          <div>Activation date: {props.task.ActiveTime}</div>
          <div className="mb-1">
            Picked up products scans:{" "}
            {props.task.TaskDetails.PickedUpProductsGtins.length +
              props.task.TaskDetails.StoredProductsGtins.length}{" "}
            / {props.task.TaskDetails.ScansRequired}{" "}
          </div>
          <div>
            Stored products scans: {props.task.TaskDetails.StoredProductsGtins.length} /{" "}
            {props.task.TaskDetails.ScansRequired}{" "}
          </div>
        </Col>
        <Col md>
          <div>Hall number {props.hall.Number}</div>
          <div>
            {startingShelf?.ShelfPurpose} shelf {props.task.TaskDetails.StartingShelfGtin}
          </div>
          <div>
            {destinationShelf?.ShelfPurpose} shelf {props.task.TaskDetails.DestinationShelfGtin}
          </div>
          <div>Brand: {props.task.TaskDetails.ProductModelBrand}</div>
          <div>Part number: {props.task.TaskDetails.ProductModelPartNumber}</div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col> {renderCancelTaskButton()} </Col>
        <Col>
          {" "}
          {renderCancelCausesDropdownMenu()} <div className="mt-2">{cancelCause}</div>{" "}
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(!showModal)}>
        <Modal.Header closeButton>
          <Modal.Title>Operation not successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>
    </Container>
  );
}

export default ManagerActiveTask;
