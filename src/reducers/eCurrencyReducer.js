const defaultState = {
    eCurrencies: [],
};

export default (state = defaultState, action) => {
    switch(action.type){
        case 'SAVE_ECURRENCIES':
            return action.payload;
        default:
            return state;
    }
}