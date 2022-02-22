import React, { useEffect, useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import ManagerEmployee from "./ManagerEmployee";

function ManagerViewEmployees() {
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const [hall, setHall] = useState(null);
  const [manager, setManager] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    if (halls.length == 0 || hall) return;
    setFilteredEmployees(halls[0].Employees);
    setHall(halls[0]);
  }, [halls]);

  function renderHallsDropdownMenu() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select hall
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {halls.map((hall) => (
            <Dropdown.Item
              key={hall.id}
              onClick={async () => {
                setHall(hall);
                setFilteredEmployees(hall.Employees);
                setManager(null);
              }}
            >
              {hall.Number}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        <div className="mt-2">{hall ? "Hall number " + hall.Number : ""}</div>
      </Dropdown>
    );
  }

  function renderManagersDropdownMenu() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select manager
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {filteredEmployees
            .filter((employee) => employee.Role == "Manager")
            .map((manager) => (
              <Dropdown.Item key={manager.id} onClick={() => setManager(manager)}>
                {manager.Name + " " + manager.Surname}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
        <div className="mt-2">
          {manager ? "Manager " + manager.Name + " " + manager.Surname : ""}
        </div>
      </Dropdown>
    );
  }

  return (
    <Container>
      <Row>
        <Col>{renderHallsDropdownMenu()}</Col>
        <Col>{renderManagersDropdownMenu()}</Col>
      </Row>
      <Row className="pt-2">
        <Col>
          {filteredEmployees.map((employee) => (
            <div className="pt-3" key={employee.id}>
              <ManagerEmployee manager={manager} hall={hall} employeeId={employee.id} />
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
export default ManagerViewEmployees;
