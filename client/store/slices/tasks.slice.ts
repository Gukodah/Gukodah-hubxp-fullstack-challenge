import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    email: "",
    first_name: "",
    last_name: ""
};

export const tasksSlice = createSlice({
    name: "tasks",
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

export const { setUser } = tasksSlice.actions;

export const tasksReducer = tasksSlice.reducer;
