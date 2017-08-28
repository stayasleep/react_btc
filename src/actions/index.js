import axios from 'axios';
import
    {
        BTC_HISTORICAL,
    }
    from './types';

export function btcPriceIndex(){
    return function (dispatch){
        axios.get("https://api.coindesk.com/v1/bpi/currentprice.json").then((response) =>{
            console.log('response from btc',response);
        })
    }
}

export function btcHistorical(){
    return function (dispatch){
        axios.get("https://api.coindesk.com/v1/bpi/historical/close.json").then((response) =>{
            console.log('historical',response);
            if(Object.keys(response.data.bpi).length === 31){
                dispatch({
                    type: BTC_HISTORICAL,
                    payload: response.data
                })
            }
        })
    }
}