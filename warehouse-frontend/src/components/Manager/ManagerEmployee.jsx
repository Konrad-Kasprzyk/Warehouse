import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Button, Col, Container, ListGroup, Modal, Row } from 'react-bootstrap';
import ManagerPastTask from './ManagerPastTask';
import ManagerActiveTask from './ManagerActiveTask';

function ManagerEmployee(props) {
  // @ts-ignore
  const employees = useSelector((state) => state.employees.value);
  const [renderPastTasks, setRenderPastTasks] = useState(false);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    let employee = employees.find(
      (employee) => employee.id == props.employeeId,
    );
    if (!employee) return;
    employee = JSON.parse(JSON.stringify(employee));
    employee.Tasks.forEach((task) => {
      if (task.QueueTime)
        task.QueueTime = task.QueueTime.substr(0, 16).replace('T', ' ');
      if (task.ActiveTime)
        task.ActiveTime = task.ActiveTime.substr(0, 16).replace('T', ' ');
      if (task.CancelTime)
        task.CancelTime = task.CancelTime.substr(0, 16).replace('T', ' ');
      if (task.FinishTime)
        task.FinishTime = task.FinishTime.substr(0, 16).replace('T', ' ');
    });
    if (employee.ActiveTask) {
      employee.ActiveTask.QueueTime = employee.ActiveTask.QueueTime.substr(
        0,
        16,
      ).replace('T', ' ');
      employee.ActiveTask.ActiveTime = employee.ActiveTask.ActiveTime.substr(
        0,
        16,
      ).replace('T', ' ');
    }
    setEmployee(employee);
  }, [employees]);

  function generatePastTasks() {
    return (
      <ListGroup className="p-2">
        {employee.Tasks.map((task) => (
          <ListGroup.Item key={task.id}>
            <ManagerPastTask task={task} hall={props.hall} />
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
        </Col>
        <Col>
          <div>Role: {employee?.Role}</div>
        </Col>
      </Row>
      <Row>
        <Col>
          {employee?.ActiveTask ? (
            <ManagerActiveTask
              manager={props.manager}
              task={employee.ActiveTask}
              employeeId={props.employeeId}
              hall={props.hall}
            />
          ) : (
            "Employee doesn't have an active task"
          )}
        </Col>
      </Row>
      <Row className="p-2">
        <Col>
          <div className="text-center">
            <Button onClick={() => setRenderPastTasks(!renderPastTasks)}>
              {renderPastTasks ? 'Hide finished tasks' : 'Show finished tasks'}
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>{renderPastTasks ? generatePastTasks() : ''}</Col>
      </Row>
    </Container>
  );
}

export default ManagerEmployee;
