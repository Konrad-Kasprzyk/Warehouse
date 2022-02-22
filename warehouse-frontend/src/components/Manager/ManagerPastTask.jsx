import { useEffect, useState } from "react";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function ManagerPastTask(props) {
  const [startingShelfPurpose, setStartingShelfPurpose] = useState("Storage");
  const [destinationShelfPurpose, setDestinationShelfPurpose] = useState("Shipment");

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

  return (
    <Container>
      <Row>
        <Col md>
          <div>Task {props.task.Status}</div>
          <div>Queue date: {props.task.QueueTime}</div>
          <div>Activation date: {props.task.ActiveTime}</div>
          <div>
            {props.task.FinishTime ? "Finish date: " : "Cancel date: "}
            {props.task.FinishTime ? props.task.FinishTime : props.task.CancelTime}
          </div>
          <div>Products count: {props.task.TaskDetails.ScansRequired}</div>
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
      </Row>
    </Container>
  );
}

export default ManagerPastTask;
