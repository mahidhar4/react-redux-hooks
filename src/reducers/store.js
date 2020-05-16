import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import mockData from '../mock-data.json';
import configData from "../global-config.json";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const createStoreFn = initialState =>
    createStore(
        combineReducers({...reducers }), {
            tasks: {
                tasksList: mockData
            },
            config: {
                configData
            },
            ...initialState
        },
        composeEnhancers(applyMiddleware(thunk))
    );

export const store = createStoreFn();