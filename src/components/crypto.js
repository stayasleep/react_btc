import React, { Component } from 'react';
import { withScreenSize } from '@vx/responsive';
import { LinearGradient} from '@vx/gradient';
import { connect } from 'react-redux';
import { btcPriceIndex, btcHistorical, ethOHLC } from '../actions/index';
import priceFormat from '../utilities/price_format';
import Chart from './chart';
import Eth from './eth';

class Bitcoin extends Component{
    constructor(props){
        super(props);
        this.state={onETH: false};
        this.switchCharts = this.switchCharts.bind(this);
    }

    switchCharts(){
        this.setState({onETH: !this.state.onETH});
    }



    componentDidMount(){
        this.props.btcHistorical();
        this.props.ethOHLC();
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
        const { eth, screenWidth, screenHeight } = this.props; //gets screen size from HOC wSS
        const chartWidth = screenWidth*0.6;
        const chartHeight = screenHeight*0.8;

        const prices = Object.keys(this.props.btc).map((day) =>{
            return(
                {day: day, price: this.props.btc[day]}
            )
        });
        const ethIndex=eth.map((arr, index)=>{
            // let date = new Date(arr[0] *1000);
            return {time: arr[0], price: arr[4]};
        });

        let priceDifference;
        let symbolDifference;
        let ethDifference;
        let ethValue;
        if(prices.length !== 0) {
            priceDifference = (prices[prices.length - 1].price - prices[prices.length - 2].price).toFixed(4);
            priceDifference > 0 ? symbolDifference = "+": symbolDifference = "-";
        }
        if(ethIndex.length !== 0){
            ethValue = (ethIndex[ethIndex.length - 1].price - ethIndex[19].price).toFixed(4);
            ethValue > 0 ? ethDifference = "+" : ethDifference = "-";
        }

        return(
            <div className="bitcoinComp">
                {this.background(screenWidth, screenHeight)}
                <div className="center">
                    <div className="chartContainer" style={{width:`${chartWidth}px`, height:`${chartHeight}px`}}>
                        <div className="title">
                            <div className="btcTitle">
                                {!this.state.onETH ?"Bitcoin Price Chart" : "Ethereum 24HR Price Chart"}
                            </div>
                            {/*Sometimes we have to do things that are ugly*/}
                            {!this.state.onETH ? (
                                <div>
                                    {Object.keys(this.props.btc).length === 0 ? (
                                            <p> Loading...</p>
                                        ) : (
                                            <div className="currentAndDifference">
                                                <div className="currentPrice"> CurrentPrice: {priceFormat(prices[prices.length - 1].price)}</div>
                                                <div className={symbolDifference === "+" ? "pos" : "neg"}>{symbolDifference}{priceDifference}</div>
                                            </div>
                                        )
                                    }
                                </div>
                                ) : (
                                <div>
                                    {Object.keys(this.props.eth).length === 0 ? (
                                        <p>Loading...</p>
                                        ) : (
                                        <div className="currentAndDifference">
                                            <div className="currentPrice"> Current Price: {priceFormat(ethIndex[ethIndex.length - 1].price)}</div>
                                            <div className={ethDifference === "+" ? "pos" : "neg" }>{ethDifference}{ethValue}</div>
                                        </div>
                                        )

                                    }
                                </div>
                                )
                            }
                        </div>
                        {!this.state.onETH ? (
                                <Chart
                                    width={chartWidth}
                                    height={chartHeight}
                                    prices={prices}
                                />
                            ) : (
                                <Eth
                                    width={chartWidth}
                                    height={chartHeight}
                                    ethIndex = {ethIndex}
                                />
                            )
                        }

                    </div>
                    <div>
                        {!this.state.onETH ?
                            (
                                <div>
                                    <div className="disclaimer">{this.props.disclaimer}</div>
                                    < div className = "disclaimer eth" onClick={this.switchCharts}>Switch to Ethereum</div>
                                </div>
                            ): (
                                <div>
                                    <div className="disclaimer">{this.props.ethDisclaimer}</div>
                                    <div className="disclaimer eth" onClick={this.switchCharts}>Switch to Bitcoin</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return{
        btc: state.bitState.history,
        disclaimer: state.bitState.disclaimer,
        ethDisclaimer: state.ethState.disclaimer,
        eth: state.ethState.historical
    }
}

export default connect(mapStateToProps,{btcPriceIndex, btcHistorical, ethOHLC})(withScreenSize(Bitcoin));