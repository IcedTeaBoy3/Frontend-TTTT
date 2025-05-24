import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./Slice/authSlice";
import appointmentReducer from "./Slice/appointmentSlice";

// Cấu hình Redux Persist cho orderReducer
const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth", "appointment"], // Chỉ lưu trữ authReducer và appointmentReducer
};
// Gộp reducer với persistReducer chỉ cho orderReducer
const rootReducer = combineReducers({
    auth: authReducer,
    appointment: appointmentReducer,
    // Các reducer khác nếu cần
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Bỏ kiểm tra serializable để tránh lỗi
        }),
});

export const persistor = persistStore(store);
