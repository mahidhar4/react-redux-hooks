import React from "react";
import './PlusIcon.scss'
const PlusIcon = ({
    style = {},
    fill = "#000",
    width = "100%",
    className = "",
    viewBox = "0 0 512 512",
    ...other
}) => (
        <svg
            width={width}
            style={style}
            height={width}
            viewBox={viewBox}
            className={`svg-icon ${className || ""}`}
            {...other}
        >
            <path
                fill={fill}
                d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z" /><path fill="#FFF" d="M391.5,214.5H297v-93.9c0-4-3.2-7.2-7.2-7.2h-68.1c-4,0-7.2,3.2-7.2,7.2v93.9h-93.9c-4,0-7.2,3.2-7.2,7.2v69.2c0,4,3.2,7.2,7.2,7.2h93.9v93.4c0,4,3.2,7.2,7.2,7.2h68.1c4,0,7.2-3.2,7.2-7.2v-93.4h94.5c4,0,7.2-3.2,7.2-7.2v-69.2C398.7,217.7,395.4,214.5,391.5,214.5z"
            />
        </svg>
    );

export default PlusIcon;
