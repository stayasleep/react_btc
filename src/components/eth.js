import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { bisector } from 'd3';
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
        const {height,hideTooltip, eth, showTooltip,tooltipData, tooltipLeft, tooltipTop, width} = this.props;
        const margin = {top: 30, right: 0, bottom: 45, left: 15};

        const childHeight = height - margin.top- margin.bottom;

        const loader = <div>Loading...</div>;
        if (eth.length === 0) return null;

        const bisectDate = bisector(d => x(d)).left;

        const ethIndex=eth.map((arr, index)=>{
            // let date = new Date(arr[0] *1000);
            return {time: arr[0], price: arr[4]};
        });

        console.log('eth index',ethIndex);

        const x = d => new Date(d.time *1000);
        const y = d => d.price;

        const minPrice = Math.min(...ethIndex.map(y));
        const maxPrice = Math.max(...ethIndex.map(y));

        const firstPoint = ethIndex[0];
        const lastPoint = ethIndex[ethIndex.length - 1];

        const minPriceData = [
            {
                time: x(firstPoint),
                price: minPrice
            }, {
                time: x(lastPoint),
                price: minPrice
            }
        ];
        const maxPriceData = [
            {
                time:x(firstPoint),
                price: maxPrice
            }, {
                time: x(lastPoint),
                price: maxPrice
            }
        ];

        //set the scale width of the component and get the ranges for the scale
        const xScale = scaleTime({
            range: [0, width], //will span the entire component
            domain: [Math.min(...ethIndex.map(x)), Math.max(...ethIndex.map(x))]
        });
        const yScale =scaleLinear({
            range: [childHeight, 0],
            domain:[minPrice, maxPrice]
        });

        return(
            <div className="chart">
                <svg width={width} height={height} ref={s => (this.svg = s)}  >
                    <AxisRight
                        hideAxisLine
                        hideTicks
                        //left={0}
                        y={y}
                        data={ethIndex}
                        scale={yScale}
                        //top={0}
                        stroke="red"
                        tickLabelComponent={<text fill="#ffffff" fontSize={11} textAnchor="middle"/>}

                    />
                    <AxisBottom
                        hideAxisLine
                        //hideTicks
                        //numTicks={4}
                        tickLabelComponent={<text dx="0.33em"  fill="#ffffff" fontSize={11} textAnchor="middle"/>}
                        top={yScale(minPrice)}
                        data={ethIndex}
                        scale={xScale}
                        x={x}
                    />
                    <LinearGradient
                        id="area-fill"
                        from="#fbc2eb"
                        to="#a6c1ee"
                        fromOpacity={1}
                        toOpacity={.2}
                        //defines the way we color in the graph
                    />
                    <MaxPrice
                        data={maxPriceData}
                        yScale={yScale}
                        xScale={xScale}
                        x={x}
                        y={y}
                        yText={yScale(maxPrice)}
                        label={maxPrice}
                    />
                    <MinPrice
                        x={x}
                        y={y}
                        data={minPriceData}
                        yScale={yScale}
                        xScale={xScale}
                        //label={minPrice}
                        yText={yScale(minPrice)}

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
                        //creates out blue line at every x,y coordinate
                    />
                    <Bar
                        data={ethIndex}
                        width={width}
                        height={childHeight} //so it displays only within the imported Eth comp
                        fill="transparent" //we want the bars invisible so we can use function below
                        onMouseMove={data => event =>{
                            const {x: xPoint} = localPoint(this.svg,event);
                            const x0 = xScale.invert(xPoint);
                            const index = bisectDate(data, x0, 1);
                            //values on left and right of the bar
                            const d0 = data[index -1];
                            const d1 = data[index];
                            const d = x0 - xScale(x(d0)) > xScale(x(d1)) - x0 ? d1: d0;
                            showTooltip({
                                tooltipLeft: xScale(x(d)),
                                tooltipTop: yScale(y(d)),
                                tooltipData: d,
                            })
                        }}
                        onMouseLeave={data => event => hideTooltip()}
                    />
                    {tooltipData && <g>
                        <Line
                            //this vertical line will only be as wide as itself.
                            from={{x: tooltipLeft, y: yScale(y(maxPriceData[0]))}}
                            to={{x: tooltipLeft, y: yScale(y(minPriceData[0]))}}
                            stroke="#000000"
                            strokeDasharray="2,2"
                        />
                        <Line
                            //this horizontal line will be the intersection
                            from={{x: xScale(x(firstPoint)), y: tooltipTop}}
                            to={{x:xScale(x(lastPoint)) , y: tooltipTop}}
                            stroke="#ffffff"
                            strokeDasharray="2,2"
                        />
                        <circle
                            r="4"
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            fill="#43d0bd"
                            style={{pointerEvents: "none"}}
                        />
                    </g>}
                </svg>
                {tooltipData &&
                    <Tooltip style={{backgroundColor: "#141518", color:"#FFFFFF"}} top={tooltipTop+10} left={tooltipLeft+10}>
                        Closing: {priceFormat(y(tooltipData))},
                    </Tooltip>
                }
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
//if you dont wrap it withTooltip, then it will not be the proper component height
export default connect(mapStateToProps,{ ethOHLC })(withTooltip(Eth));
// export default connect(mapStateToProps,{ethOHLC})(Eth);