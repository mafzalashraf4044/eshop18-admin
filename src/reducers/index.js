import { combineReducers } from 'redux';
import userReducer from './userReducer';
import orderReducer from './orderReducer';
import eCurrencyReducer from './eCurrencyReducer';
import paymentMethodReducer from './paymentMethodReducer';
import newsReducer from './newsReducer';
import loginReducer from './loginReducer';

const rootReducer = combineReducers({
    userReducer,
    orderReducer,
    eCurrencyReducer,
    paymentMethodReducer,
    newsReducer,
    loginReducer,
});

export default rootReducer;