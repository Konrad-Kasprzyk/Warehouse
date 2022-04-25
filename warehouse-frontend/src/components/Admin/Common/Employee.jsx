import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import React from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  ListGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { EmployeeAPI } from '../../../api/employee.api';
import { removeEmployee } from '../../../features/employees';
import { HallAPI } from '../../../api/hall.api';
import { updateHall } from '../../../features/halls';
import EmployeePastTask from './EmployeePastTask';
import EmployeeActiveTask from './EmployeeActiceTask';

function Employee(props) {
  const dispatch = useDispatch();
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  // @ts-ignore
  const employees = useSelector((state) => state.employees.value);
  const [employeeFinishedTasks, setEmployeeFinishedTasks] = useState([]);
  const [employeeActiveTask, setEmployeeActiveTask] = useState(null);
  const [renderPastTasks, setRenderPastTasks] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  function displayModal(err) {
    setModalMessage(err instanceof Error ? err.message : err);
    setShowModal(!showModal);
  }

  useEffect(() => {
    if (employees.length == 0) return;
    let employee = employees.find(
      (employee) => employee.id == props.employeeId,
    );
    if (!employee) return;
    setEmployee(employee);
    let tasks = JSON.parse(JSON.stringify(employee.Tasks));
    if (employee.CancelledTasks?.length > 0)
      tasks.push(...JSON.parse(JSON.stringify(employee.CancelledTasks)));
    if (employee.ActiveTask) {
      const activeTask = JSON.parse(JSON.stringify(employee.ActiveTask));
      activeTask.QueueTime = activeTask.QueueTime.substr(0, 16).replace(
        'T',
        ' ',
      );
      activeTask.ActiveTime = activeTask.ActiveTime.substr(0, 16).replace(
        'T',
        ' ',
      );
      setEmployeeActiveTask(activeTask);
    } else setEmployeeActiveTask(null);
    tasks.sort(function (a, b) {
      return a.ActiveTime - b.ActiveTime;
    });
    tasks.forEach((task) => {
      if (task.QueueTime)
        task.QueueTime = task.QueueTime.substr(0, 16).replace('T', ' ');
      if (task.ActiveTime)
        task.ActiveTime = task.ActiveTime.substr(0, 16).replace('T', ' ');
      if (task.CancelTime)
        task.CancelTime = task.CancelTime.substr(0, 16).replace('T', ' ');
      if (task.FinishTime)
        task.FinishTime = task.FinishTime.substr(0, 16).replace('T', ' ');
    });
    setEmployeeFinishedTasks(tasks);
  }, [employees]);

  async function deleteEmployee() {
    try {
      await EmployeeAPI.delete(props.employeeId);
      dispatch(removeEmployee(props.employeeId));
      const hall = await HallAPI.get(props.hallNumber);
      dispatch(updateHall(hall));
    } catch (err) {
      displayModal(err);
    }
  }

  async function changeEmployeeHall(newHallId) {
    try {
      const newHall = await HallAPI.moveEmployeeToAnotherHall(
        props.employeeId,
        newHallId,
      );
      const oldHall = await HallAPI.get(props.hallNumber);
      dispatch(updateHall(oldHall));
      dispatch(updateHall(newHall));
    } catch (err) {
      displayModal(err);
    }
  }

  function renderHallsDropdownMenu() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Change employee hall
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {halls
            .filter((hall) => hall.Number != props.hallNumber)
            .map((hall) => (
              <Dropdown.Item
                key={hall.id}
                onClick={() => {
                  changeEmployeeHall(hall.Number);
                }}
              >
                {hall.Number}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function generatePastTasks() {
    return (
      <ListGroup className="p-2">
        {employeeFinishedTasks.map((task) => (
          <ListGroup.Item key={task.id}>
            <EmployeePastTask task={task} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }

  return (
    <Container className="border border-primary rounded">
      <Row className="pt-2">
        <Col>
          <div>
            {employee?.Name} {employee?.Surname}
          </div>
          <div>Role: {employee?.Role}</div>
        </Col>
        <Col className="p-3">Hall number: {props.hallNumber}</Col>
      </Row>
      <Row className="pb-2">
        <Col>
          <Button variant="danger" onClick={() => deleteEmployee()}>
            Delete employee
          </Button>
        </Col>
        <Col>{renderHallsDropdownMenu()}</Col>
      </Row>
      <Row>
        <Col>
          {employeeActiveTask ? (
            <EmployeeActiveTask
              task={employeeActiveTask}
              employeeId={props.employeeId}
              hallNumber={props.hallNumber}
            />
          ) : (
            "Employee doesn't have an active task"
          )}
        </Col>
      </Row>
      <Row className="p-2">
        <Col>
          <Button onClick={() => setRenderPastTasks(!renderPastTasks)}>
            {renderPastTasks ? 'Hide tasks' : 'Show tasks'}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>{renderPastTasks ? generatePastTasks() : ''}</Col>
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

export default Employee;
