import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import AddTask from "./Admin/AddTask";
import ViewQueuedTasks from "./Admin/ViewQueuedTasks";
import Blank from "./Admin/Blank";
import ViewEmployees from "./Admin/ViewEmployees";
import AddEmployee from "./Admin/AddEmployee";
import React from "react";
import AddHallOrShelf from "./Admin/AddHallOrShelf";
import AddProductModel from "./Admin/AddProductModel";
import ViewHallsAndAddProducts from "./Admin/ViewHallsAndAddProducts";

function renderSwitch(view) {
  switch (view) {
    case "AddTask":
      return <AddTask />;
    case "ViewTasks":
      return <ViewQueuedTasks />;
    case "ViewHallsAndAddProducts":
      return <ViewHallsAndAddProducts />;
    case "AddEmployee":
      return <AddEmployee />;
    case "ViewEmployees":
      return <ViewEmployees />;
    case "AddHallOrShelf":
      return <AddHallOrShelf />;
    case "AddProductModel":
      return <AddProductModel />;
    case "Blank":
      return <Blank />;
    default:
      return <Blank />;
  }
}

function AdminProducts() {
  const [view, setView] = useState("Blank");

  return (
    <div className="text-center">
      <Dropdown className="mb-3">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Choose action
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setView("AddTask")}>Add task</Dropdown.Item>
          <Dropdown.Item onClick={() => setView("ViewTasks")}>Activate task</Dropdown.Item>
          <Dropdown.Item onClick={() => setView("ViewHallsAndAddProducts")}>
            View halls and add products
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setView("AddEmployee")}>Add employee</Dropdown.Item>
          <Dropdown.Item onClick={() => setView("AddHallOrShelf")}>Add hall or shelf</Dropdown.Item>
          <Dropdown.Item onClick={() => setView("AddProductModel")}>
            Add product model
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setView("ViewEmployees")}>
            View and manage employees
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {renderSwitch(view)}
    </div>
  );
}

export default AdminProducts;
