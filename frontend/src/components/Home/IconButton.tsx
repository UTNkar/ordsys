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
                className="w-50 mb-1 mt-4"
                src={iconUrl}
                alt={text}
            />
            <div className="button-text">{ text }</div>
        </>
    );
}

export default IconButton
