import types from './types';
import { combineReducers } from 'redux';

const tasksList = (state = [], action) => {
    switch (action.type) {
        case types.TASKS_GET:
            return action.response || state;
        case types.TASKS_SAVE:
            return [...state, action.response];
        case types.TASKS_UPDATE:
            return state.map((item) => {
                if (item.taskId === action.response.taskId) {
                    return action.response;
                } else {
                    return item;
                }
            });
        case types.TASKS_DELETE:
            return state.filter((item) => {
                return item.taskId !== action.response.taskId;
            });
        default:
            return state;
    }
};



export default combineReducers({
    tasksList
});