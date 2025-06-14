import { createSlice } from "@reduxjs/toolkit";
import { IEvent } from "../../types/types";

export interface IAppSlice {
    keyboard: boolean;
    vote: {
        title: string;
        amount: string;
    };
    events: IEvent[];
}

const initialState: IAppSlice = {
    keyboard: false,
    vote: {
        title: "",
        amount: "",
    },
    events: [],
};

const AppSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setEvents: (state, { payload }) => {
            state.events = payload;
        },
        setVote: (state, { payload }) => {
            state.vote.title = payload.title;
        },
        openKeyboard: (state) => {
            state.keyboard = true;
        },
        closeKeyboard: (state) => {
            state.keyboard = false;
        },
        setAmount: (state, { payload }) => {
            if (payload === "del") {
                state.vote.amount = state.vote.amount.slice(0, -1);
                return;
            }

            if (payload === "c") {
                state.vote.amount = "";
                return;
            }
            state.vote.amount = state.vote.amount + payload;
        },
    },
});

export const { setEvents, setVote, openKeyboard, closeKeyboard, setAmount } = AppSlice.actions;

export default AppSlice.reducer;
