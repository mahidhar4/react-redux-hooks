import types from './types';
import { combineReducers } from 'redux';

const tasksList = (state = [], action) => {
    switch (action.type) {
        case types.TASKS_GET:
            return action.response || state;
        default:
            return state;
    }
};

export default combineReducers({
    tasksList
});