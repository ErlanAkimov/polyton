import { createSlice } from "@reduxjs/toolkit";

export interface IUserSlice {
    id: number;
    status: number | null;
    ref: number;
}

const initialState: IUserSlice = {
    id: 0,
    status: null,
    ref: 0,
};

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (_, action) => action.payload,
    },
});

export const { setUser } = UserSlice.actions;

export default UserSlice.reducer;
