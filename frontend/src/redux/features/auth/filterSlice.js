import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filteredUsers: []
}

const filterUserSlice = createSlice({
  name: "filterUser",
  initialState,
  reducers: {
    FILTER_USERS(state, action) {
      const { users, search } = action.payload;
      
      const tempUsers = users?.filter((user) => {
        if (!user) return false;

        const name = user.name?.toLowerCase() || ''; 
        const email = user.email?.toLowerCase() || '';
        const searchTerm = search?.toLowerCase() || '';

        return name.includes(searchTerm) || email.includes(searchTerm);
      }) || [];

      state.filteredUsers = tempUsers;
    }
  },
});

export const { FILTER_USERS } = filterUserSlice.actions
export const selectFilteredUsers = (state) => state.filterUser.filteredUsers

export default filterUserSlice.reducer