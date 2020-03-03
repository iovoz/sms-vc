import axios from 'axios';
import {
    SERVER_ERROR, SUBMIT_PENDING, SUBMIT_COMPLETE
} from '../reducers/ajaxStatusReducer'

export function sendmycode() {
    return async dispatch => {
        try {
            dispatch({
                type: SUBMIT_PENDING,
                sendForm: ''
            });

            const result = await axios.post('/sendcode');
            console.log('result=', result)

            dispatch({
                type: SUBMIT_COMPLETE
            });

        }
        catch (error) {
            dispatch({
                type: SERVER_ERROR
            });
        }
    }
}