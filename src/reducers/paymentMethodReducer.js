const defaultState = {
    paymentMethods: [],
};

export default (state = defaultState, action) => {
    switch(action.type){
        case 'SAVE_PAYMENT_METHODS':
            return action.payload;
        default:
            return state;
    }
}