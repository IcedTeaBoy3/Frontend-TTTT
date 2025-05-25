import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
    name: "appointment",
    initialState: {
        doctor: null,
        schedule: null,
        timeSlot: null,
        selectedDate: null,
        selectedTime: null,
        reason: null,
    },
    reducers: {
        setAppointment: (state, action) => {
            const { doctor, schedule, timeSlot, selectedDate, selectedTime, reason } = action.payload;
            state.doctor = doctor;
            state.schedule = schedule;
            state.timeSlot = timeSlot;
            state.selectedDate = selectedDate;
            state.selectedTime = selectedTime;
            state.reason = reason;
        },
        updateAppointment: (state, action) => {
            Object.assign(state, action.payload);
        },
        resetAppointment: (state) => {
            state.doctor = null;
            state.schedule = null;
            state.timeSlot = null;
            state.selectedDate = null;
            state.selectedTime = null;
            state.reason = null;
        },
    },
});

export const { setAppointment,updateAppointment, resetAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
