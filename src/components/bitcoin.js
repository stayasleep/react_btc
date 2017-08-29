import React, { Component } from 'react';
import { withScreenSize } from '@vx/responsive';
import { LinearGradient} from '@vx/gradient';
import { connect } from 'react-redux';
import { btcPriceIndex, btcHistorical } from '../actions/index';
import priceFormat from '../utilities/price_format';
import Chart from './chart';
import { withTooltip, Tooltip } from '@vx/tooltip';


class Bitcoin extends Component{
    componentDidMount(){
        // this.props.btcPriceIndex();
        this.props.btcHistorical();
    }

    background(width, height){
        return (
            <svg width={width} height={height}>
                <LinearGradient id="fill" vertical={false}>
                    <stop stopColor="#a943e4" offset="0%"/>
                    <stop stopColor="#f5f989" offset="50%" />
                    <stop stopColor="#ffaf84" offset="100%" />
                </LinearGradient>
                 <rect width={width} height={height} fill="url(#fill)" />
            </svg>
        )
    };


    render(){
        const { screenWidth, screenHeight } = this.props; //gets screen size from HOC wSS
        console.log('btc prop',this.props);
        const chartWidth = screenWidth*0.6;
        const chartHeight = screenHeight*0.8;

        const prices = Object.keys(this.props.btc).map((day) =>{
            return(
                {day: day, price: this.props.btc[day]}
            )
        });
        let priceDifference;
        let symbolDifference;
        if(prices.length !== 0) {
            priceDifference = (prices[prices.length - 1].price - prices[prices.length - 2].price).toFixed(4);
            priceDifference > 0 ? symbolDifference = "+": symbolDifference = "-";
        }

        return(
            <div className="bitcoinComp">
                {this.background(screenWidth, screenHeight)}
                <div className="center">
                    <div className="chartContainer" style={{width:`${chartWidth}px`, height:`${chartHeight}px`}}>
                        <div className="title">
                            Bitcoin Price Chart
                            {Object.keys(this.props.btc).length === 0 ? (
                                    <p> Loading...</p>
                                ) : (
                                    <div className="currentAndDifference">
                                        <p className="currentPrice"> Current Price: {priceFormat(prices[prices.length-1].price)}</p>
                                        <div className={symbolDifference === "+" ? "pos" : "neg"}>{symbolDifference}{priceDifference}</div>
                                    </div>
                                )
                            }
                        </div>
                        <Chart
                            width={chartWidth}
                            height={chartHeight}
                            prices = {prices}
                        />
                    </div>
                    <div className="disclaimer">{this.props.disclaimer}</div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return{
        btc: state.bitState.history,
        disclaimer: state.bitState.disclaimer
    }
}

export default connect(mapStateToProps,{btcPriceIndex, btcHistorical})(withScreenSize(Bitcoin));