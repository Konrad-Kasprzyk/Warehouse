import { createSlice } from '@reduxjs/toolkit';

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { value: [] },
  reducers: {
    replaceAllTasks: (state, action) => {
      state.value = action.payload;
    },

    updateTask: (state, action) => {
      const newTask = action.payload;
      const currentTaskIndex = state.value.findIndex(
        (task) => task.id === newTask.id,
      );
      if (currentTaskIndex < 0) return;
      state.value[currentTaskIndex] = newTask;
    },

    addTask: (state, action) => {
      const newTask = action.payload;
      state.value.push(newTask);
    },

    removeTask: (state, action) => {
      const taskId = action.payload;
      const index = state.value.findIndex((task) => task.id === taskId);
      if (index < 0) return;
      state.value.splice(index, 1);
    },
  },
});

export const { replaceAllTasks, updateTask, addTask, removeTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;
