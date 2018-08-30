//Helpers
import update from 'immutability-helper';

const defaultState = {
    users: [],
};

export default (state = defaultState, action) => {
    switch(action.type){
        case 'SAVE_USERS':
            return action.payload;
        default:
            return state;
    }
}