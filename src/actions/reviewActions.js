import _ from 'lodash';
import axios from 'axios';
import {API_URL} from '../constants';

const getHeaders = () => ({Authorization: "Bearer " + localStorage.getItem("token"), "x-requested-with": "XMLHttpRequest"});

export const saveReviews = (reviews) => {
    return {
        type: 'SAVE_REVIEWS',
        payload: {reviews},
    };
}

export const getReviews = (searchTerm) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/review?sortType=DESC&sortBy=createdAt${searchTerm ? `&searchTerm=${searchTerm}` : ''}`, {headers: getHeaders()});
    }
}

export const addReview = (news) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/review/`, news, {headers: getHeaders()});
    }
}

export const editReview = (id, news) => {
    return (dispatch) => {
        return axios.patch(`${API_URL}/review/` + id, news, {headers: getHeaders()});
    }
}

export const dltReview = (id) => {
    return (dispatch) => {
        return axios.delete(`${API_URL}/review/` + id, {headers: getHeaders()});
    }
}