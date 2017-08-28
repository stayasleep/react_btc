import { combineReducers } from 'redux';
import btc_reducer from './btc_reducer';

const rootReducer = combineReducers({
    bitState: btc_reducer
});

export default rootReducer;