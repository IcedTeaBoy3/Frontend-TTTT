import {createSlice} from '@reduxjs/toolkit';
const doctorSlice = createSlice({
    name: 'doctor',
    initialState: {
        doctorId: null,
        hospital: null,
        specialties: [],
        position: null,
        qualification: null,
        experience: null,
        description: null,
    },
    reducers: {
        setDoctor: (state, action) => {
            const doctorData = action.payload;
            state.doctorId = doctorData.doctorId || null;
            state.hospital = doctorData.hospital || null;
            state.specialties = doctorData.specialties || [];
            state.position = doctorData.position || null;
            state.qualification = doctorData.qualification || null;
            state.experience = doctorData.experience || null;
            state.description = doctorData.description || null;
        },
        updateDoctor: (state, action) => {
            const updatedData = action.payload;
            state.doctorId = updatedData.doctorId || state.doctorId;
            state.hospital = updatedData.hospital || state.hospital;
            state.specialties = updatedData.specialties || state.specialties;
            state.position = updatedData.position || state.position;
            state.qualification = updatedData.qualification || state.qualification;
            state.experience = updatedData.experience || state.experience;
            state.description = updatedData.description || state.description;
        },
        resetDoctor: (state) => {
            state.doctorId = null;
            state.hospital = null;
            state.specialties = [];
            state.position = null;
            state.qualification = null;
            state.experience = null;
            state.description = null;
        },
    },
});
export const { setDoctor, resetDoctor, updateDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;