import _ from 'lodash';
import axios from 'axios';
import {API_URL} from '../constants';

const getHeaders = () => ({Authorization: "Bearer " + localStorage.getItem("token"), "x-requested-with": "XMLHttpRequest"});

export const saveIsLoggedIn = (isLoggedIn) => {
    return {
        type: 'SAVE_IS_LOGGED_IN',
        payload: {isLoggedIn},
    };
}

export const checkIsLoggedIn = () => {
  return (dispatch) => {
      return axios.get(`${API_URL}/is-logged-in`, {headers: getHeaders()});
  }
}

export const login = (credentials) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/admin-login`, credentials, {headers: getHeaders()});
    }
}

export const logout = () => {
  return (dispatch) => {
      return axios.get(`${API_URL}/logout`, {headers: getHeaders()});
  }
}