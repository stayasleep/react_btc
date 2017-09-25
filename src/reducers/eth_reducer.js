import { ETH_24HRS } from '../actions/types';

const default_state = {historical:[], disclaimer:""};

export default function(state = default_state, action){
    switch (action.type){
        case ETH_24HRS:
            return {...state, historical:action.payload, disclaimer:"Provided By Cryptowat.ch"};
        default:
            return state;
    }
}