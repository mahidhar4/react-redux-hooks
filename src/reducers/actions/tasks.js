import types from '../types';

export const actions = {
    getListOfTasks: () => async dispatch => {
        dispatch({ type: types.TASKS_GET });
    },
    saveTask: (item) => async dispatch => {
        dispatch({ type: types.TASKS_SAVE, response: item });
    },
    updateTask: (item) => async dispatch => {
        dispatch({ type: types.TASKS_UPDATE, response: item });
    },
    deleteTask: (item) => async dispatch => {
        dispatch({ type: types.TASKS_DELETE, response: item });
    }

};