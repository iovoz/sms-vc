import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const initialState = {};
const enhancers = [];
const middleware = [
    thunk
];

const composeFn = typeof (window) !== 'undefined' ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;
const composedEnhancers = composeFn(
    applyMiddleware(...middleware),
    ...enhancers
);

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
);

export function createStoreWithState(initialState) {
    return createStore(
        rootReducer,
        initialState,
        composedEnhancers
    );
}

export default store;
