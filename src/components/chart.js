import React from 'react';
import { scaleTime, scaleLinear } from '@vx/scale';
import { LinePath, AreaClosed } from '@vx/shape';

export default (props) =>{
    const margin={
        top: 90,
        right: 0,
        bottom: 45,
        left: 0,
    };
    const childHeight = props.height -margin.top - margin.bottom;

    const x = d => new Date(d.day); //for each x point
    const y = d => d.price; //for each y point
    const minPrice = Math.min(...props.prices.map(y));
    const maxPrice = Math.max(...props.prices.map(y));

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
                {props.prices.length === 0 ? (
                    <rect width={props.width} height={props.height} fill="#141518"/>
                    ) : (
                        <LinePath
                            data={props.prices}
                            yScale={yScale}
                            xScale={xScale}
                            x={x}
                            y={y}
                        />
                    )
                }
            </svg>
        </div>
    )
}

