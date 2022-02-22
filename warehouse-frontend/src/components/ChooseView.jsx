import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { EmployeeAPI } from "../api/employee.api";
import { HallAPI } from "../api/hall.api";
import { replaceAllEmployees } from "../features/employees";
import { replaceAllHalls } from "../features/halls";
import AdminProducts from "./AdminProducts";
import ManagerViewEmployees from "./Manager/ManagerViewEmployees";

function ChooseView() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchHallsEmployeesTasks() {
      const allHalls = await HallAPI.getAll();
      dispatch(replaceAllHalls(allHalls));
      const allEmployees = await EmployeeAPI.getAll();
      dispatch(replaceAllEmployees(allEmployees));
    }
    fetchHallsEmployeesTasks();
  }, []);

  const [chosenView, setChosenView] = useState("Manager");

  function changeView() {
    if (chosenView == "Manager") setChosenView("Admin");
    else setChosenView("Manager");
  }

  return (
    <Container className="mt-4 mb-3">
      <Row>
        <div className="text-center">
          <Col>
            <Button variant="primary" onClick={() => changeView()}>
              {chosenView == "Manager" ? "Switch to admin view" : "Switch to manager view"}
            </Button>
          </Col>
        </div>
      </Row>
      <Row className="mt-4">
        <div className="text-center">
          <Col>{chosenView == "Manager" ? <ManagerViewEmployees /> : <AdminProducts />}</Col>
        </div>
      </Row>
    </Container>
  );
}
export default ChooseView;
