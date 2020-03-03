export const SERVER_ERROR = 'beyondcars/ajaxStatus/fetchDataServerError';
export const FETCH_PENDING = 'beyondcars/ajaxStatus/fetchPending';
export const FETCH_COMPLETE = 'beyondcars/ajaxStatus/fetchComplete';
export const SUBMIT_PENDING = 'beyondcars/ajaxStatus/submitPending';
export const SUBMIT_COMPLETE = 'beyondcars/ajaxStatus/submitComplete';
export const RESET_STATUS = 'beyondcars/ajaxStatus/resetStatus';

export const initialState = {
    isServerError: false,
    isLoading: false,
    isSubmitting: false,
    isSubmitSuccess: false,
    serverStatus: '',
    serverMessage: '',
    sendFrom: '',
    serverErrors: []
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SERVER_ERROR:
            return {
                ...state,
                isServerError: true,
                isSubmitSuccess: false,
                isLoading: false,
                isSubmitting: false,
                serverStatus: action.serverStatus,
                serverMessage: action.serverMessage,
                serverErrors: action.serverErrors
            };
        case FETCH_PENDING:
            return {
                ...state,
                isLoading: true
            };
        case FETCH_COMPLETE:
            return {
                ...state,
                isLoading: false,
                isServerError: false,
                isSubmitSuccess: false,
                serverStatus: ''
            };
        case SUBMIT_PENDING:
            return {
                ...state,
                isServerError: false,
                isSubmitting: true,
                isSubmitSuccess: false,
                serverStatus: '',
                serverMessage: '',
                sendForm: action.sendForm
            };
        case SUBMIT_COMPLETE:
            return {
                ...state,
                isSubmitting: false,
                isSubmitSuccess: true,
                isServerError: false
            };
        case RESET_STATUS:
            return {
                ...state,
                isServerError: false,
                isLoading: false,
                isSubmitting: false,
                isSubmitSuccess: false,
                serverStatus: '',
                serverMessage: ''
            };
        default:
            return state;
    }
}
