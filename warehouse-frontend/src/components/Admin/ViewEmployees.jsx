import React, { useEffect, useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Employee from "./Common/Employee";

function ViewEmployees() {
  // @ts-ignore
  const employees = useSelector((state) => state.employees.value);
  // @ts-ignore
  const halls = useSelector((state) => state.halls.value);
  const [role, setRole] = useState("");
  const [hallNumber, setHallNumber] = useState(1);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    if (halls.length == 0 || employees.length == 0) return;
    let newFilteredEmployees = [];
    if (hallNumber)
      newFilteredEmployees = halls.find((hall) => hall.Number == hallNumber).Employees;
    else newFilteredEmployees = employees;
    if (role)
      newFilteredEmployees = newFilteredEmployees.filter((employee) => employee.Role == role);
    setFilteredEmployees(newFilteredEmployees);
  }, [role, hallNumber, employees, halls]);

  function renderHallsDropdownMenu() {
    return (
      <Dropdown.Menu>
        {halls.map((hall) => (
          <Dropdown.Item key={hall.id} onClick={() => setHallNumber(hall.Number)}>
            {hall.Number}
          </Dropdown.Item>
        ))}
        <Dropdown.Item key={0} onClick={() => setHallNumber(null)}>
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
                Select Role
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setRole("Employee")}>Employee</Dropdown.Item>
                <Dropdown.Item onClick={() => setRole("Manager")}>Manager</Dropdown.Item>
                <Dropdown.Item onClick={() => setRole("")}>Clear</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="pt-2">{role}</div>
          </div>
        </Col>
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
      </Row>
      <Row className="pt-2">
        <Col>
          {filteredEmployees.map((employee) => (
            <div className="pt-3" key={employee.id}>
              <Employee employeeId={employee.id} hallNumber={hallNumber} />
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
export default ViewEmployees;
