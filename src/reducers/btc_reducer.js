import {
    BTC_HISTORICAL,
} from '../actions/types';


const default_state = {history:{}, error: null};

export default function(state = default_state, action){
    switch(action.type){
        case BTC_HISTORICAL:
            return {...state, history: action.payload.bpi, disclaimer: action.payload.disclaimer, };
        default:
            return state;
    }
}