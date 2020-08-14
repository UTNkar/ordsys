import React from 'react';
import './IconButton.scss';

interface IconButtonProps {
    iconUrl: string
    text: string
}

function IconButton({ iconUrl, text }: IconButtonProps) {
    return (
        <>
            <img
                className="icon-button-img"
                src={iconUrl}
                alt={text}
            />
            <div className="icon-button-text">{ text }</div>
        </>
    );
}

export default IconButton
