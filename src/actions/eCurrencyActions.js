import _ from 'lodash';
import axios from 'axios';
import {API_URL} from '../constants';

const getHeaders = () => ({Authorization: "Bearer " + localStorage.getItem("token"), "x-requested-with": "XMLHttpRequest"});

export const saveECurrencies = (eCurrencies) => {
    return {
        type: 'SAVE_ECURRENCIES',
        payload: {eCurrencies},
    };
}

export const getECurrencies = (searchTerm) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/ecurrency?sortType=DESC&sortBy=createdAt${searchTerm ? `&searchTerm=${searchTerm}` : ''}`, {headers: getHeaders()});
    }
}

export const addECurrency = (eCurrency) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/ecurrency/`, {
            title: eCurrency.title,
            reserves: eCurrency.reserves,
            buyCommissions: eCurrency.buyCommissions,
            sellCommissions: eCurrency.sellCommissions,
            exchangeCommissions: eCurrency.exchangeCommissions
        }, {headers: getHeaders()});
    }
}

export const editECurrency = (id, eCurrency) => {
    return (dispatch) => {
        return axios.patch(`${API_URL}/ecurrency/` + id, {
            reserves: eCurrency.reserves,
            buyCommissions: eCurrency.buyCommissions,
            sellCommissions: eCurrency.sellCommissions,
            exchangeCommissions: eCurrency.exchangeCommissions
        }, {headers: getHeaders()});
    }
}

export const dltECurrency = (id) => {
    return (dispatch) => {
        return axios.delete(`${API_URL}/ecurrency/` + id, {headers: getHeaders()});
    }
}