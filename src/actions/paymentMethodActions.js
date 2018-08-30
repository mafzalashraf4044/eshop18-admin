import _ from 'lodash';
import axios from 'axios';
import {API_URL} from '../constants';

const getHeaders = () => ({Authorization: "Bearer " + localStorage.getItem("token"), "x-requested-with": "XMLHttpRequest"});

export const savePaymentMethods = (paymentMethods) => {
    return {
        type: 'SAVE_PAYMENT_METHODS',
        payload: {paymentMethods},
    };
}

export const getPaymentMethods = (searchTerm) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/paymentmethod${searchTerm ? `?searchTerm=${searchTerm}` : ''}`, {headers: getHeaders()});
    }
}

export const addPaymentMethod = (paymentMethod) => {
    return (dispatch) => {
        return axios.post('${API_URL}/paymentmethod/', paymentMethod, {headers: getHeaders()});
    }
}

export const editPaymentMethod = (id, paymentMethod) => {
    return (dispatch) => {
        return axios.patch('${API_URL}/paymentmethod/' + id, paymentMethod, {headers: getHeaders()});
    }
}

export const dltPaymentMethod = (id) => {
    return (dispatch) => {
        return axios.delete('${API_URL}/paymentmethod/' + id, {headers: getHeaders()});
    }
}