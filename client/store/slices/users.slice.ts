import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    email: "",
    first_name: "",
    last_name: ""
};

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.first_name = action.payload.first_name;
            state.last_name = action.payload.last_name;
        },
    },
});

export const { setUser } = usersSlice.actions;

export const usersReducer = usersSlice.reducer;
