import React, { useEffect, useState } from 'react';
import { Col, Container, Dropdown, ListGroup, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import EmployeeQueuedTask from './Common/EmployeeQueuedTask';

function ViewQueuedTasks() {
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const [hall, setHall] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    if (!hall) changeHall(1);
    else changeHall(hall.Number);
  }, [halls]);

  useEffect(() => {
    async function filter() {
      if (!hall) return;
      let filteredTasks = hall.Tasks.filter((task) => task.Status == 'Queued');
      filteredTasks = JSON.parse(JSON.stringify(filteredTasks));
      filteredTasks.forEach((task) => {
        task.QueueTime = task.QueueTime.substr(0, 16).replace('T', ' ');
      });
      setFilteredTasks(filteredTasks);
      const filteredEmployees = hall.Employees.filter(
        (employee) => !employee.ActiveTask,
      );
      setFilteredEmployees(filteredEmployees);
    }
    filter();
  }, [hall]);

  function changeHall(hallNumber) {
    setFilteredTasks([]);
    setHall(halls.find((hall) => hall.Number == hallNumber));
  }

  function renderHallsDropdownMenu() {
    return (
      <Dropdown.Menu>
        {halls.map((hall) => (
          <Dropdown.Item
            key={hall.id}
            onClick={() => {
              changeHall(hall.Number);
              setEmployee(null);
            }}
          >
            {hall.Number}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    );
  }

  function renderEmployeesDropdownMenu() {
    return (
      <Dropdown.Menu>
        {filteredEmployees.map((employee) => (
          <Dropdown.Item
            key={employee.id}
            onClick={() => setEmployee(employee)}
          >
            {employee.Name + ' ' + employee.Surname}
          </Dropdown.Item>
        ))}
        <Dropdown.Item key={0} onClick={() => setEmployee(null)}>
          Clear
        </Dropdown.Item>
      </Dropdown.Menu>
    );
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
          <div className="text-center">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select employee
              </Dropdown.Toggle>

              {renderEmployeesDropdownMenu()}
            </Dropdown>
            <div className="pt-2">
              {employee ? employee.Name + ' ' + employee.Surname : ''}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="pt-2">
        <Col>
          <ListGroup className="p-2">
            {filteredTasks.map((task) => (
              <ListGroup.Item key={task.id}>
                <Container>
                  <EmployeeQueuedTask
                    hall={hall}
                    task={task}
                    employee={employee}
                    setEmployee={setEmployee}
                  />
                </Container>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
export default ViewQueuedTasks;
