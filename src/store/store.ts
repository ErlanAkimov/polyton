// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UserReducer, { IUserSlice } from "./slices/UserSlice";
import AppReducer, { IAppSlice } from "./slices/AppSlice";

const store = configureStore({
    reducer: {
        app: AppReducer,
        user: UserReducer,
    },
});

export default store;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<{
    app: IAppSlice;
    user: IUserSlice;
}> = useSelector;
