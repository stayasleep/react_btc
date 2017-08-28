import React from 'react';
import { scaleTime, scaleLinear } from '@vx/scale';
import { LinePath, AreaClosed } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
import MaxPrice from '../utilities/max_price';
import priceFormat from '../utilities/price_format';

export default (props) =>{
    const margin={
        top: 90,
        right: 0,
        bottom: 45,
        left: 0,
    };
    const childHeight = props.height -margin.top - margin.bottom;
    if(props.prices.length===0) return null;
    const x = d => new Date(d.day); //for each x point
    const y = d => d.price; //for each y point
    const firstPoint = props.prices[0];
    const currentPoint = props.prices[props.prices.length - 1];

    const minPrice = Math.min(...props.prices.map(y));
    const maxPrice = Math.max(...props.prices.map(y));
    const maxPriceData = [
        {
            day: x(firstPoint),
            price: maxPrice
        }, {
            day: x(currentPoint),
            price: maxPrice
        }
    ];
    console.log('max data',maxPriceData);

    const xScale = scaleTime({
        range: [0, props.width],
        domain: [Math.min(...props.prices.map(x)),Math.max(...props.prices.map(x))]
    });
    console.log('x',xScale.domain());
    const yScale = scaleLinear({
        range:[childHeight, 0],
        domain: [minPrice, maxPrice]
    });
    console.log('y',yScale.domain());

    return(
        <div className="chart">
            <svg width={props.width} height={childHeight}>
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
                <AreaClosed
                    data={props.prices}
                    yScale={yScale}
                    xScale={xScale}
                    x={x}
                    y={y}
                    fill="url(#area-fill)"
                    stroke="transparent"//gets rid of the x axis line
                    //fills in below the curve without color gradient choice
                />
                <LinePath
                    data={props.prices}
                    yScale={yScale}
                    xScale={xScale}
                    x={x}
                    y={y}
                    //connects each point on the line graph
                />
            </svg>
        </div>
    )
}

