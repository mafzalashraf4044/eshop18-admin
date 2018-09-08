//Helpers
import update from 'immutability-helper';

const defaultState = {
    reviews: [],
};

export default (state = defaultState, action) => {
    switch(action.type){
        case 'SAVE_REVIEWS':
            return action.payload;
        default:
            return state;
    }
}