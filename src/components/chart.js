import React, { Component } from 'react';
import { bisector } from 'd3';
import { AxisBottom } from '@vx/axis';
import { localPoint } from '@vx/event';
import { scaleTime, scaleLinear } from '@vx/scale';
import { LinePath, AreaClosed, Bar, Line } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
import { withTooltip, Tooltip } from '@vx/tooltip';
import MaxPrice from '../utilities/max_price';
import MinPrice from '../utilities/min_price';
import priceFormat from '../utilities/price_format';

class Chart extends Component {
    constructor(props){
        super(props);
    }

    render() {
        console.log('chart prop', this.props);
        const { height, hideTooltip, prices, showTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop, width } = this.props;
        const margin = {
            top: 30,
            right: 0,
            bottom: 45,
            left: 0,
        };

        const childHeight = height - margin.top - margin.bottom;

        const bisectDate = bisector(d => x(d)).left;

        if (prices.length === 0) return null;
        const x = d => new Date(d.day); //for each x point
        const y = d => d.price; //for each y point
        const firstPoint = prices[0];
        const currentPoint = prices[prices.length - 1];

        const minPrice = Math.min(...prices.map(y));
        const maxPrice = Math.max(...prices.map(y));
        const maxPriceData = [
            {
                day: x(firstPoint),
                price: maxPrice
            }, {
                day: x(currentPoint),
                price: maxPrice
            }
        ];
        const minPriceData = [
            {
                day: x(firstPoint),
                price: minPrice
            }, {
                day: x(currentPoint),
                price: minPrice
            }
        ];

        const xScale = scaleTime({
            range: [0, width],
            domain: [Math.min(...prices.map(x)), Math.max(...prices.map(x))]
        });
        console.log('x', xScale.domain());
        const yScale = scaleLinear({
            range: [childHeight, 0],
            domain: [minPrice, maxPrice]
        });

        return (
            <div className="chart">
                <svg width={width} height={height} ref={s => (this.svg = s)}>
                    <AxisBottom
                        hideAxisLine //no dotted black axis line for the dates
                        numTicks={4}
                        //hideTicks //no tick marks
                        tickLabelComponent={<text fill="#ffffff" fontSize={11} textAnchor="middle"/>}
                        top={yScale(minPrice)} //sets the position to the bottom of the graph
                        data={prices} //pass in array of obj
                        scale={xScale} //we want the x scale
                        x={x}
                    />
                    <LinearGradient
                        id="area-fill"
                        from="#141518"
                        to="#141518"
                        fromOpacity={1}
                        toOpacity={.2}
                        //fills the gradient color below the curve line and above x axis
                    />
                    <MaxPrice
                        data={maxPriceData} //first and last day of our graph
                        yScale={yScale}
                        xScale={xScale}
                        x={x}
                        y={y}
                        label={priceFormat(maxPrice)} //max price to display for 31 day history
                        yText={yScale(maxPrice)}

                    />
                    <MinPrice
                        data={minPriceData}
                        yScale={yScale}
                        xScale={xScale}
                        x={x}
                        y={y}
                        label={priceFormat(minPrice)}
                        yText={yScale(minPrice)}
                    />
                    <AreaClosed
                        data={prices}
                        yScale={yScale}
                        xScale={xScale}
                        x={x}
                        y={y}
                        fill="url(#area-fill)"
                        stroke="transparent"//gets rid of the x axis line
                        //fills in below the curve without color gradient choice
                    />
                    <LinePath
                        data={prices}
                        yScale={yScale}
                        xScale={xScale}
                        x={x}
                        y={y}
                        //connects each point on the line graph
                    />
                    <Bar
                        data={prices}
                        width={width}
                        height={childHeight}
                        fill="transparent"
                        onMouseMove={data => event => {
                            //convert event coord to local points
                            const { x: xPoint } = localPoint(this.svg, event);
                            const x0 = xScale.invert(xPoint);
                            const index = bisectDate(data, x0,1 );
                            //get value on either side of index
                            const d0 = data[index-1];
                            const d1 = data[index];
                            const d = x0 - xScale(x(d0)) > xScale(x(d1)) - x0 ? d1: d0;
                            showTooltip({
                                tooltipLeft: xScale(x(d)),
                                tooltipTop: yScale(y(d)),
                                tooltipData: d,
                            });

                        }}
                        onMouseLeave={data => event => hideTooltip()}
                    />
                    {tooltipData && <g>
                        <Line
                            from={{x: tooltipLeft, y: yScale(y(maxPriceData[0])) }}
                            to={{ x: tooltipLeft, y: yScale(y(minPriceData[0])) }}
                            stroke="#ffffff"
                            strokeDasharray="2,2"

                        />
                        <circle
                            r="8"
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            fill="#43d0bd"
                            fillOpacity={0.4}
                            style={{pointerEvents:"none"}}
                        />
                        <circle
                            r="4"
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            fill="#43d0bd"
                            style={{pointerEvents:"none"}}
                        />
                    </g>}
                </svg>
                {/*Give a tool tip with y coords as you traverse each x coord on the vertical line*/}
                {tooltipData &&
                    <Tooltip style={{backgroundColor: "#984ed5", color:"#fff"}} top={tooltipTop +10 } left={tooltipLeft +10}>
                        {priceFormat(y(tooltipData))}
                    </Tooltip>
                }
            </div>
        )
    }
}

export default withTooltip(Chart);