import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filteredProducts: []
}

const filterProductSlice = createSlice({
  name: "filterProduct",
  initialState,
  reducers: {
    FILTER_PRODUCTS(state, action) {
      const { products, search } = action.payload;

      const tempProducts = products?.filter((product) => {
        if (!product) return false;

        const name = product.name?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        const searchTerm = search?.toLowerCase() || '';

        return name.includes(searchTerm) || category.includes(searchTerm);
      }) || [];

      state.filteredProducts = tempProducts;
    },
  },
});

export const {FILTER_PRODUCTS} = filterProductSlice.actions

export const selectFilteredProducts = (state) => state.filterProduct.filteredProducts

export default filterProductSlice.reducer