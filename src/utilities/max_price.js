import React from 'react';
import { LinePath } from '@vx/shape';

export default ({data, label, yText, yScale, xScale, x, y}) => {
    return (
        <g>
            <LinePath
                data={data}
                yScale={yScale}
                xScale={xScale}
                x={x}
                y={y}
                strokeDasharray="4,4" //the line at the maximum y
                strokeOpacity="0.4"
            />
            <text fill="grey" dy="1.3em" dx="1em" y={yText} fontSize="12">
                {label}
            </text>
        </g>
    );
};
