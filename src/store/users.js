import { createSlice } from '@reduxjs/toolkit'

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        roles: [],
        permissions: [],
        assessors: [],
        candidates: []
    },
    reducers: {
        SET_ROLES: (state, action) => {
            state.roles = action.payload
        },
        SET_PERMISSIONS: (state, action) => {
            state.permissions = action.payload
        },
        SET_ASSESSOR: (state, action) => {
            state.assessors = action.payload
        },
        SET_CANDIDATE: (state, action) => {
            state.candidates = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { SET_ROLES, SET_PERMISSIONS, SET_ASSESSOR, SET_CANDIDATE } = usersSlice.actions

export default usersSlice.reducer