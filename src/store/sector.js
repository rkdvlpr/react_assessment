import { createSlice } from '@reduxjs/toolkit'

export const sectorSlice = createSlice({
    name: 'sector',
    initialState: {
        sectors: [],
        jobroles: [],
        batches: [],
    },
    reducers: {
        SET_SECTOR: (state, action) => {
            state.sectors = action.payload
        },
        SET_JOBROLE: (state, action) => {
            state.jobroles = action.payload
        },
        SET_BATCH: (state, action) => {
            state.batches = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { SET_SECTOR, SET_JOBROLE, SET_BATCH } = sectorSlice.actions

export default sectorSlice.reducer