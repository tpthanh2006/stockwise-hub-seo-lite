import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import emailService from "../../../services/emailService";

const initialState = {
  sendingEmail: false,
  emailSent: false,
  msg: "",
};

// Send Automated Email
export const automateEmail = createAsyncThunk(
  "email/automateEmail",
  async (emailData, thunkAPI) => {
    try {
      return await emailService.sendAutomatedEmail(emailData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    EMAIL_RESET(state) {
      state.sendingEmail = false;
      state.emailSent = false;
      state.msg = "";
    }
  },
  extraReducers: (builder) => {
    builder
      // Automate Email
      .addCase(automateEmail.pending, (state) => {
        state.sendingEmail = true;
      })
      .addCase(automateEmail.fulfilled, (state, action) => {
        state.sendingEmail = true;
        state.emailSent = true;
        state.msg = action.payload;
        toast.success(action.payload);
      })
      .addCase(automateEmail.rejected, (state, action) => {
        state.sendingEmail = false;
        state.emailSent = false;
        state.msg = action.payload;
        toast.success(action.payload);
      });
  }
});

export const { EMAIL_RESET } = emailSlice.actions;

export default emailSlice.reducer;