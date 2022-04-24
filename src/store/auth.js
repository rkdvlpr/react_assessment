import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
        user: null,
        permissions: []
    },
    reducers: {
        SET_USER: (state, action) => {
            state.user = action.payload
        },
        SET_TOKEN: (state, action) => {
            state.token = action.payload
            localStorage.setItem("token", action.payload)
        },
        SET_PERMISSIONS: (state, action) => {
            state.permissions = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { SET_USER, SET_TOKEN, SET_PERMISSIONS } = authSlice.actions

export default authSlice.reducer