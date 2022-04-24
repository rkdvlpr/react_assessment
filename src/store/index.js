import { configureStore } from '@reduxjs/toolkit'
import commonReducer from './common'
import authReducer from './auth'
import usersReducer from './users'
import sectorReducer from './sector'
import questionReducer from './question'

export default configureStore({
    reducer: {
        common: commonReducer,
        auth: authReducer,
        users: usersReducer,
        sector: sectorReducer,
        question: questionReducer
    }
})