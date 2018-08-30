import _ from 'lodash';
import axios from 'axios';
import {API_URL} from '../constants';

const getHeaders = () => ({Authorization: "Bearer " + localStorage.getItem("token"), "x-requested-with": "XMLHttpRequest"});

export const saveUsers = (users) => {
    return {
        type: 'SAVE_USERS',
        payload: {users},
    };
}

export const getUsers = (searchTerm) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/user${searchTerm ? `?searchTerm=${searchTerm}` : ''}`, {headers: getHeaders()});
    }
}

export const dltUser = (id) => {
    return (dispatch) => {
        return axios.delete(`${API_URL}/user/` + id, {headers: getHeaders()});
    }
}

export const toggleUserVerifiedStatus = (id, index, isVerified) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/update-verifed-status/` + id, {isVerified}, {headers: getHeaders()});
    }
}

export const sendEmailToList = (emails, subject, content) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/send-email-to-list/`, {emails, subject, content}, {headers: getHeaders()});
    }
}

export const getUserOrdersAndAccounts = (id) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/get-user-orders-and-accounts/` + id, {headers: getHeaders()});
    }
}