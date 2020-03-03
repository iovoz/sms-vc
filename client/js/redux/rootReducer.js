import { combineReducers } from 'redux';
import ajaxStatusReducer from './reducers/ajaxStatusReducer';

export default combineReducers({
    ajaxStatus: ajaxStatusReducer
});
