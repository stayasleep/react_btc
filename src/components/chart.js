import React from 'react';

export default (props) =>{
    const margin={
        top: 90,
        right: 0,
        bottom: 45,
        left: 0,
    };
    const childHeight = props.height -margin.top - margin.bottom;

    return(
        <div className="chart">
            <svg width={props.width} height={childHeight}>
                <rect width={props.width} height={props.height} fill="#141518"/>
            </svg>
        </div>
    )
}

