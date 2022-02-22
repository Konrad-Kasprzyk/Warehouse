import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { TaskAPI } from "../../../api/task.api";
import { updateEmployee } from "../../../features/employees";
import { EmployeeAPI } from "../../../api/employee.api";
import { updateTask } from "../../../features/tasks";

function EmployeeActiveTask(props) {
  const dispatch = useDispatch();
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const [startingShelf, setStartingShelf] = useState(null);
  const [destinationShelf, setDestinationShelf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  function displayModal(err) {
    setModalMessage(err instanceof Error ? err.message : err);
    setShowModal(!showModal);
  }

  useEffect(() => {
    const hall = halls.find((hall) => hall.Number == props.hallNumber);
    const startingShelf = hall.Shelves.find(
      (shelf) => shelf.Gtin == props.task.TaskDetails.StartingShelfGtin
    );
    setStartingShelf(startingShelf);
    const destinationShelf = hall.Shelves.find(
      (shelf) => shelf.Gtin == props.task.TaskDetails.DestinationShelfGtin
    );
    setDestinationShelf(destinationShelf);
  }, []);

  async function finishTask() {
    try {
      const finishedTask = await TaskAPI.finishTask(props.employeeId, props.hallNumber);
      const employee = await EmployeeAPI.get(props.employeeId);
      dispatch(updateEmployee(employee));
      dispatch(updateTask(finishedTask));
    } catch (err) {
      displayModal(err);
    }
  }

  async function scanStartingProduct() {
    if (
      props.task.TaskDetails.PickedUpProductsGtins.length +
        props.task.TaskDetails.StoredProductsGtins.length >=
      props.task.TaskDetails.ScansRequired
    )
      return;
    try {
      const productGtin = startingShelf.ProductGtins.find(
        (gtin) =>
          !props.task.TaskDetails.PickedUpProductsGtins.includes(gtin) &&
          !props.task.TaskDetails.StoredProductsGtins.includes(gtin)
      );
      if (!productGtin) throw new Error("Products missing on starting shelf");
      await TaskAPI.scanShelf(props.task.id, startingShelf.Gtin);
      const updatedTask = await TaskAPI.scanProduct(props.task.id, productGtin);
      const employee = await EmployeeAPI.get(props.employeeId);
      dispatch(updateTask(updatedTask));
      dispatch(updateEmployee(employee));
    } catch (err) {
      displayModal(err);
    }
  }

  async function scanDestinationProduct() {
    if (props.task.TaskDetails.StoredProductsGtins.length >= props.task.TaskDetails.ScansRequired)
      return;

    try {
      const productGtin = startingShelf.ProductGtins.find(
        (gtin) =>
          props.task.TaskDetails.PickedUpProductsGtins.includes(gtin) &&
          !props.task.TaskDetails.StoredProductsGtins.includes(gtin)
      );
      if (!productGtin) throw new Error("Product to store missing");
      await TaskAPI.scanShelf(props.task.id, destinationShelf.Gtin);
      const updatedTask = await TaskAPI.scanProduct(props.task.id, productGtin);
      const employee = await EmployeeAPI.get(props.employeeId);
      dispatch(updateTask(updatedTask));
      dispatch(updateEmployee(employee));
    } catch (err) {
      displayModal(err);
    }
  }

  function renderFinishTaskButton() {
    return (
      <Button variant="success" onClick={() => finishTask()}>
        Finish task
      </Button>
    );
  }

  return (
    <Container className="square border border-secondary rounded">
      <Row className="p-1">
        <Col md className="pb-1">
          <div>
            Task Active{" "}
            {props.task.TaskDetails.StoredProductsGtins.length ==
            props.task.TaskDetails.ScansRequired
              ? renderFinishTaskButton()
              : ""}
          </div>
          <div>Queue date: {props.task.QueueTime}</div>
          <div>Activation date: {props.task.ActiveTime}</div>
          <div className="mb-1">
            Picked up products scans:{" "}
            {props.task.TaskDetails.PickedUpProductsGtins.length +
              props.task.TaskDetails.StoredProductsGtins.length}{" "}
            / {props.task.TaskDetails.ScansRequired}{" "}
            <Button variant="success" size="sm" onClick={() => scanStartingProduct()}>
              +
            </Button>
          </div>
          <div>
            Stored products scans: {props.task.TaskDetails.StoredProductsGtins.length} /{" "}
            {props.task.TaskDetails.ScansRequired}{" "}
            <span className="ms-4">
              <Button variant="success" size="sm" onClick={() => scanDestinationProduct()}>
                +
              </Button>
            </span>
          </div>
        </Col>
        <Col md>
          <div>Hall number {props.hallNumber}</div>
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
      <Modal show={showModal} onHide={() => setShowModal(!showModal)}>
        <Modal.Header closeButton>
          <Modal.Title>Operation not successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>
    </Container>
  );
}

export default EmployeeActiveTask;
