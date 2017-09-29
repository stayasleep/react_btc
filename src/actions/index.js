import axios from 'axios';
import
    {
        BTC_HISTORICAL,
        ETH_24HRS,
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
            //console.log('historical',response.data.bpi.length);

            if(Object.keys(response.data.bpi).length === 31){
                dispatch({
                    type: BTC_HISTORICAL,
                    payload: response.data
                })
            }
        })
    }
}

// const BASE = "http://localhost:8080/react_btc/data.php";
const BASE = "/data.php";

export function ethOHLC(){
    let data ={
        url: "https://api.cryptowat.ch/markets/gdax/ethusd/ohlc",
        periods: 180,
    };

    return function(dispatch){
        axios.post(`${BASE}`, data).then((response) =>{
            let data = JSON.parse(response.data);
            let result = data.result;
            //console.log('eth api',result[180]);

            dispatch({
                type: ETH_24HRS,
                payload: result[180]
            });

        }).catch(err=>{
            console.log('my errr',err);
        })
    }
}
