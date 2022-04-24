import { createSlice } from '@reduxjs/toolkit'

export const commonSlice = createSlice({
    name: 'common',
    initialState: {
        snackbar: { status: false, message: '', type: 'success', duration: null },
        dashboard_count: {},
        mail_templates: [],
        states: [],
        language:[]
    },
    reducers: {
        OPEN_SNACKBAR: (state, action) => {
            state.snackbar = { duration: 6000, ...action.payload, status: true }
        },
        CLOSE_SNACKBAR: (state, action) => {
            state.snackbar = { ...action.payload, status: false, message: '', type: 'success', duration: null }
        },
        SET_DASHBOARD_COUNT: (state, action) => {
            state.dashboard_count = action.payload
        },
        SET_MAIL_TEMPLATE: (state, action) => {
            state.mail_templates = action.payload
        },
        SET_STATE: (state, action) => {
            state.states = action.payload
        },
        SET_LANGUAGE: (state, action) => {
            state.language = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { OPEN_SNACKBAR, CLOSE_SNACKBAR, SET_DASHBOARD_COUNT, SET_MAIL_TEMPLATE, SET_STATE, SET_LANGUAGE } = commonSlice.actions

export default commonSlice.reducer