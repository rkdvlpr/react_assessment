import { createSlice } from '@reduxjs/toolkit'

export const questionSlice = createSlice({
    name: 'question',
    initialState: {
        items: [],
    },
    reducers: {
        SET_QUESTIONS: (state, action) => {
            state.items = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { SET_QUESTIONS } = questionSlice.actions

export default questionSlice.reducer