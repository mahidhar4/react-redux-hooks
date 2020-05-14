import types from '../types';

export const actions = {
    getListOfTasks: () => async dispatch => {
        dispatch({ type: types.TASKS_GET });
    }
};