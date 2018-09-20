const defaultState = {
    isLoggedIn: false,
    user: {},
};

export default (state = defaultState, action) => {
    switch(action.type){
        case 'SAVE_IS_LOGGED_IN':
            return action.payload;
        default:
            return state;
    }
}