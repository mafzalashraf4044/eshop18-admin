import _ from 'lodash';
import axios from 'axios';
import {API_URL} from '../constants';

const getHeaders = () => ({Authorization: "Bearer " + localStorage.getItem("token"), "x-requested-with": "XMLHttpRequest"});

export const getConfig = () => {
    return (dispatch) => {
        return axios.get(`${API_URL}/config-admin`, {headers: getHeaders()});
    }
}

export const createOrUpdateConfig = (config) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/config`, config, {headers: getHeaders()});
    }
}