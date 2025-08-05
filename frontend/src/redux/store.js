import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/features/auth/authSlice";
import emailReducer from "../redux/features/email/emailSlice";
import productReducer from "../redux/features/product/productSlice";
import filterUserReducer from "../redux/features/auth/filterSlice";
import filterProductReducer from "../redux/features/product/filterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    product: productReducer,

    filterUser: filterUserReducer,
    filterProduct: filterProductReducer,
  },
});