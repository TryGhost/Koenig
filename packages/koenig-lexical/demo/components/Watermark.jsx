import React from 'react';
import {ReactComponent as GhostFavicon} from './icons/ghost-favicon.svg';

const Watermark = () => {
    return (
        <div className="absolute bottom-4 left-6 flex items-center font-mono text-sm tracking-tight text-black">
            <GhostFavicon className="mr-2 h-6 w-6" />
            <span className="pr-1 font-bold tracking-wide">Koenig</span> 
            editor
        </div>
    );
};

export default Watermark;
