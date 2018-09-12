const defaultState = {
    orders: [],
};

export default (state = defaultState, action) => {
    switch(action.type){
        case 'SAVE_ORDERS':
            return action.payload;
        default:
            return state;
    }
}