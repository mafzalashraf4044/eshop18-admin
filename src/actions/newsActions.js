import _ from 'lodash';
import axios from 'axios';
import {API_URL} from '../constants';

const getHeaders = () => ({Authorization: "Bearer " + localStorage.getItem("token"), "x-requested-with": "XMLHttpRequest"});

export const saveNews = (news) => {
    return {
        type: 'SAVE_NEWS',
        payload: {news},
    };
}

export const getOrders = (type, searchTerm, user) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/order?type=${type}${searchTerm ? `&searchTerm=${searchTerm}` : ''}${user ? `&user=${user}` : ''}`, {headers: getHeaders()});
    }
}

export const getNews = (searchTerm) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/news${searchTerm ? `?searchTerm=${searchTerm}` : ''}`, {headers: getHeaders()});
    }
}

export const addNews = (news) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/news/`, news, {headers: getHeaders()});
    }
}

export const editNews = (id, news) => {
    return (dispatch) => {
        return axios.patch(`${API_URL}/news/` + id, news, {headers: getHeaders()});
    }
}

export const dltNews = (id) => {
    return (dispatch) => {
        return axios.delete(`${API_URL}/news/` + id, {headers: getHeaders()});
    }
}