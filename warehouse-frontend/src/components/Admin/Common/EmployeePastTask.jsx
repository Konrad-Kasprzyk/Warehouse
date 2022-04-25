import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

function EmployeePastTask(props) {
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const [hallNumber, setHallNumber] = useState(1);
  const [startingShelfPurpose, setStartingShelfPurpose] = useState('Storage');
  const [destinationShelfPurpose, setDestinationShelfPurpose] =
    useState('Shipment');

  useEffect(() => {
    const hall = halls.find((hall) =>
      hall.Tasks.some((task) => task.id === props.task.id),
    );
    const startingShelfPurpose = hall.Shelves.find(
      (shelf) => shelf.Gtin == props.task.TaskDetails.StartingShelfGtin,
    ).ShelfPurpose;
    setStartingShelfPurpose(startingShelfPurpose);
    const destinationShelfPurpose = hall.Shelves.find(
      (shelf) => shelf.Gtin == props.task.TaskDetails.DestinationShelfGtin,
    ).ShelfPurpose;
    setDestinationShelfPurpose(destinationShelfPurpose);
    setHallNumber(hall.Number);
  }, []);

  return (
    <Container>
      <Row>
        <Col md>
          <div>Task {props.task.Status}</div>
          <div>Queue date: {props.task.QueueTime}</div>
          <div>Activation date: {props.task.ActiveTime}</div>
          <div>
            {props.task.FinishTime ? 'Finish date: ' : 'Cancel date: '}
            {props.task.FinishTime
              ? props.task.FinishTime
              : props.task.CancelTime}
          </div>
          <div>Products count: {props.task.TaskDetails.ScansRequired}</div>
        </Col>
        <Col md>
          <div>Hall number {hallNumber}</div>
          <div>
            {startingShelfPurpose} shelf{' '}
            {props.task.TaskDetails.StartingShelfGtin}
          </div>
          <div>
            {destinationShelfPurpose} shelf{' '}
            {props.task.TaskDetails.DestinationShelfGtin}
          </div>
          <div>Brand: {props.task.TaskDetails.ProductModelBrand}</div>
          <div>
            Part number: {props.task.TaskDetails.ProductModelPartNumber}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default EmployeePastTask;
