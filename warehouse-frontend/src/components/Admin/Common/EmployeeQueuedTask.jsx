import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { TaskAPI } from "../../../api/task.api";
import { replaceAllTasks } from "../../../features/tasks";
import { replaceAllEmployees, updateEmployee } from "../../../features/employees";
import { EmployeeAPI } from "../../../api/employee.api";
import { HallAPI } from "../../../api/hall.api";
import { updateHall } from "../../../features/halls";

function EmployeeQueuedTask(props) {
  // @ts-ignore
  const employees = useSelector((state) => state.employees.value);
  const dispatch = useDispatch();
  const [startingShelfPurpose, setStartingShelfPurpose] = useState("Storage");
  const [destinationShelfPurpose, setDestinationShelfPurpose] = useState("Shipment");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  function displayModal(err, title) {
    setModalTitle(title);
    setModalMessage(err instanceof Error ? err.message : err);
    setShowModal(!showModal);
  }

  useEffect(() => {
    const startingShelfPurpose = props.hall.Shelves.find(
      (shelf) => shelf.Gtin == props.task.TaskDetails.StartingShelfGtin
    ).ShelfPurpose;
    setStartingShelfPurpose(startingShelfPurpose);
    const destinationShelfPurpose = props.hall.Shelves.find(
      (shelf) => shelf.Gtin == props.task.TaskDetails.DestinationShelfGtin
    ).ShelfPurpose;
    setDestinationShelfPurpose(destinationShelfPurpose);
  }, []);

  async function activate() {
    try {
      if (!props.employee) throw new Error("Please select an employee");
      await TaskAPI.activateTask(props.task.id, props.employee.id);
      const newEmployee = await EmployeeAPI.get(props.employee.id);
      dispatch(updateEmployee(newEmployee));
      const newHall = await HallAPI.get(props.hall.Number);
      dispatch(updateHall(newHall));
      props.setEmployee(null);
    } catch (err) {
      displayModal(err, "Task not activated");
    }
  }

  return (
    <Row>
      <Col md>
        <div>Task {props.task.Status}</div>
        <div>Queue date: {props.task.QueueTime}</div>
        <div>Products count: {props.task.TaskDetails.ScansRequired}</div>
        <Button variant="success" onClick={() => activate()}>
          Activate
        </Button>
      </Col>
      <Col md>
        <div>Hall number {props.hall.Number}</div>
        <div>
          {startingShelfPurpose} shelf {props.task.TaskDetails.StartingShelfGtin}
        </div>
        <div>
          {destinationShelfPurpose} shelf {props.task.TaskDetails.DestinationShelfGtin}
        </div>
        <div>Brand: {props.task.TaskDetails.ProductModelBrand}</div>
        <div>Part number: {props.task.TaskDetails.ProductModelPartNumber}</div>
      </Col>
      <Modal show={showModal} onHide={() => setShowModal(!showModal)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>
    </Row>
  );
}

export default EmployeeQueuedTask;
