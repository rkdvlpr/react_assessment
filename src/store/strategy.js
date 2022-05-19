import { createSlice } from '@reduxjs/toolkit'

export const strategySlice = createSlice({
    name: 'strategy',
    initialState: {
        items: [],
    },
    reducers: {
        SET_STRATEGY: (state, action) => {
            state.items = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { SET_STRATEGY } = strategySlice.actions

export default strategySlice.reducer