//Helpers
import update from 'immutability-helper';

const defaultState = {
    news: [],
};

export default (state = defaultState, action) => {
    switch(action.type){
        case 'SAVE_NEWS':
            return action.payload;
        default:
            return state;
    }
}