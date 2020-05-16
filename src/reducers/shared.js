import types from './types';
import { combineReducers } from 'redux';

const isFetching = (state = 0, action) => {
    switch (action.type) {
        case types.INCREMENT_COUNTER:
            return ++state;
        case types.DECREMENT_COUNTER:
            return --state;
        default:
            return state;
    }
};


export default combineReducers({
    isFetching
});