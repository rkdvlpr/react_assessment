import { createSlice } from '@reduxjs/toolkit'

export const assessmentSlice = createSlice({
    name: 'assessment',
    initialState: {
        items: [],
    },
    reducers: {
        SET_ASSESSMENT: (state, action) => {
            state.items = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { SET_ASSESSMENT } = assessmentSlice.actions

export default assessmentSlice.reducer