import axios from 'axios';
import { OPEN_SNACKBAR } from "../store/common";
import store from "../store";
let instance;
if (process.env.NODE_ENV === "production") {
    instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL
    });
} else {
    instance = axios.create();
}

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log(error.response);
    if (error.response.data.hasOwnProperty('message')) {
        store.dispatch(OPEN_SNACKBAR({ message: error.response.data.message, type: 'warning' }));
    } else if (error.response.data.hasOwnProperty('errors')) {
        store.dispatch(OPEN_SNACKBAR({ message: error.response.data.errors.map(v => v.msg).join(" | "), type: 'warning' }));
    } else {
        store.dispatch(OPEN_SNACKBAR({ message: error.response.statusText, type: 'error' }));
    }
    return Promise.reject(error);
});

export default instance;