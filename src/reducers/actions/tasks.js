import types from '../types';

export const actions = {
    getListOfTasks: () => async dispatch => {
        dispatch({ type: types.INCREMENT_COUNTER });
        setTimeout(function() {
            dispatch({ type: types.TASKS_GET });
            dispatch({ type: types.DECREMENT_COUNTER });
        }, 2000);
    },
    saveTask: (item) => async dispatch => {
        dispatch({ type: types.INCREMENT_COUNTER });
        setTimeout(() => {
            dispatch({ type: types.TASKS_SAVE, response: item });
            dispatch({ type: types.DECREMENT_COUNTER });
        }, 2000);

    },
    updateTask: (item) => async dispatch => {
        dispatch({ type: types.INCREMENT_COUNTER });
        setTimeout(() => {
            dispatch({ type: types.TASKS_UPDATE, response: item });
            dispatch({ type: types.DECREMENT_COUNTER });
        }, 2000);

    },
    deleteTask: (item) => async dispatch => {
        dispatch({ type: types.INCREMENT_COUNTER });
        setTimeout(() => {
            dispatch({ type: types.TASKS_DELETE, response: item });
            dispatch({ type: types.DECREMENT_COUNTER });
        }, 2000);
    }

};