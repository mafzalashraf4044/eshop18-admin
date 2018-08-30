import _ from 'lodash';
import axios from 'axios';
import {API_URL} from '../constants';

const getHeaders = () => ({Authorization: "Bearer " + localStorage.getItem("token"), "x-requested-with": "XMLHttpRequest"});

export const saveOrders = (orders) => {
    return {
        type: 'SAVE_ORDERS',
        payload: {orders},
    };
}

export const getOrders = (type, searchTerm, user) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/order?type=${type}${searchTerm ? `&searchTerm=${searchTerm}` : ''}${user ? `&user=${user}` : ''}`, {headers: getHeaders()});
    }
}

export const updateOrderStatus = (id, status) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/update-order-status/${id}`, {status}, {headers: getHeaders()});
    }
}