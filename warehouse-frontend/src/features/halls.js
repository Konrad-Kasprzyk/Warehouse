import { createSlice } from '@reduxjs/toolkit';

export const hallsSlice = createSlice({
  name: 'halls',
  initialState: { value: [] },
  reducers: {
    replaceAllHalls: (state, action) => {
      state.value = action.payload;
    },

    updateHall: (state, action) => {
      const newHall = action.payload;
      const currentHallIndex = state.value.findIndex(
        (hall) => hall.id === newHall.id,
      );
      if (currentHallIndex < 0) return;
      state.value[currentHallIndex] = newHall;
    },

    addHall: (state, action) => {
      const newHall = action.payload;
      state.value.push(newHall);
    },

    removeHall: (state, action) => {
      const hallId = action.payload;
      const index = state.value.findIndex((hall) => hall.id === hallId);
      if (index < 0) return;
      state.value.splice(index, 1);
    },
  },
});

export const { replaceAllHalls, updateHall, addHall, removeHall } =
  hallsSlice.actions;

export default hallsSlice.reducer;
