import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { ethOHLC } from '../actions/index';
import {AxisBottom, AxisRight} from '@vx/axis';
import { localPoint } from '@vx/event';
import { scaleTime, scaleLinear } from '@vx/scale';
import { LinePath, AreaClosed, Bar, Line } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
import { withTooltip, Tooltip } from '@vx/tooltip';
import MaxPrice from '../utilities/max_price';
import MinPrice from '../utilities/min_price';
import priceFormat from '../utilities/price_format';

class Eth extends Component {
    componentWillMount(){
        this.props.ethOHLC();
    }

    render(){
        console.log('eth props',this.props);
        const {height,eth, width} = this.props;
        const margin = {top: 30, right: 0, bottom: 45, left: 0};

        const childHeight = height - margin.top- margin.bottom;

        const loader = <div>Loading...</div>;
        if (eth.length === 0) return loader;

        const ethIndex=eth.map((arr, index)=>{
            // let date = new Date(arr[0] *1000);
            return {time: arr[0], price: arr[4]};
        });

        console.log('eth index',ethIndex);

        const x = d => new Date(d.time);
        const y = d => d.price;

        const minPrice = Math.min(...ethIndex.map(y));
        const maxPrice = Math.max(...ethIndex.map(y));

        const firstPoint = ethIndex[0];
        const lastPoint = ethIndex[ethIndex.length - 1];

        //set the scale width of the component and get the ranges for the scale
        const xScale = scaleTime({
            range: [0, width], //will span the entire component
            domain: [Math.min(...ethIndex.map(x)), Math.max(...ethIndex.map(x))]
        });
        const yScale =scaleLinear({
            range: [childHeight, 0],
            domain:[minPrice, maxPrice]
        });
        console.log('min',minPrice);
        console.log('max',maxPrice);
        console.log('yy',yScale(minPrice));

        return(
            <div className="chart">
                <svg width={width} height={height}>
                    <AxisBottom
                        top={childHeight}
                        data={ethIndex}
                        scale={xScale}
                        x={x}
                        label={'time'}
                        hideAxisLine
                        numTicks={4}
                        tickLabelComponent={<text fill="#ffffff" fontSize={11} textAnchor="middle"/>}
                    />
                    <LinearGradient
                        id="area-fill"
                        from="#fbc2eb"
                        to="#a6c1ee"
                        //defines the way we color in the graph
                    />
                    <AxisRight
                        y={y}
                        data={ethIndex}
                        scale={yScale}
                        top={0}
                        tickLabelComponent={<text fill="#ffffff" fontSize={11} textAnchor="middle"/>}

                    />
                    <AreaClosed
                        data={ethIndex}
                        yScale={yScale}
                        xScale={xScale}
                        x={x}
                        y={y}
                        stroke="transparent"
                        fill="url(#area-fill)"
                    />
                    <LinePath
                        data={ethIndex}
                        yScale={yScale}
                        xScale={xScale}
                        x={x}
                        y={y}
                        //creates out line at every x,y coordinate
                    />

                </svg>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        eth:state.ethState.historical,
        disclaimer: state.ethState.disclaimer,
    }
}

export default connect(mapStateToProps,{ ethOHLC })(Eth);