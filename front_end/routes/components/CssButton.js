import React from 'react';

module.exports = ({className, width, height, disabled, onClick}) => {
    var style = {
        padding: `${height/2}px 0 ${height/2}px ${width}px`,
        backgroundSize: `${width}px ${height}px`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center'
    };
    if (disabled) {
        className = className + '_disabled';
    }
    return <span style={style} className={className} onClick={!disabled && onClick || ()=>{}} />;
};
