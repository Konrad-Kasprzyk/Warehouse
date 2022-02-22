import { createSlice } from "@reduxjs/toolkit";

export const employeesSlice = createSlice({
  name: "employees",
  initialState: { value: [] },
  reducers: {
    replaceAllEmployees: (state, action) => {
      state.value = action.payload;
    },

    updateEmployee: (state, action) => {
      const newEmployee = action.payload;
      const currentEmployeeIndex = state.value.findIndex(
        (employee) => employee.id === newEmployee.id
      );
      if (currentEmployeeIndex < 0) return;
      state.value[currentEmployeeIndex] = newEmployee;
    },

    addEmployee: (state, action) => {
      const newEmployee = action.payload;
      state.value.push(newEmployee);
    },

    removeEmployee: (state, action) => {
      const employeeId = action.payload;
      const index = state.value.findIndex((employee) => employee.id === employeeId);
      if (index < 0) return;
      state.value.splice(index, 1);
    },
  },
});

export const { replaceAllEmployees, updateEmployee, addEmployee, removeEmployee } =
  employeesSlice.actions;

export default employeesSlice.reducer;
