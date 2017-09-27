import { combineReducers } from 'redux';
import btc_reducer from './btc_reducer';
import eth_reducer from './eth_reducer';

const rootReducer = combineReducers({
    bitState: btc_reducer,
    ethState: eth_reducer
});

export default rootReducer;