import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: { value: [] },
  reducers: {
    replaceAllProducts: (state, action) => {
      state.value = action.payload;
    },

    updateProduct: (state, action) => {
      const newProduct = action.payload;
      const currentProductIndex = state.value.findIndex((product) => product.id === newProduct.id);
      if (currentProductIndex < 0) return;
      state.value[currentProductIndex] = newProduct;
    },

    addProduct: (state, action) => {
      const newProduct = action.payload;
      state.value.push(newProduct);
    },

    removeProduct: (state, action) => {
      const productId = action.payload;
      const index = state.value.findIndex((product) => product.id === productId);
      if (index < 0) return;
      state.value.splice(index, 1);
    },
  },
});

export const { replaceAllProducts, updateProduct, addProduct, removeProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
