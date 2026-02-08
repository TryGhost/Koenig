import PlusCardMenuPlugin from '../plugins/PlusCardMenuPlugin';
import React from 'react';
import SlashCardMenuPlugin from '../plugins/SlashCardMenuPlugin';
import {isMobileViewport} from '../utils/isMobileViewport';

export const CardMenuPlugin = () => {
    const [hidePlusMenu, setHidePlusMenu] = React.useState(false);

    React.useEffect(() => {
        const updateViewportState = () => {
            setHidePlusMenu(isMobileViewport());
        };

        updateViewportState();
        window.addEventListener('resize', updateViewportState);

        return () => {
            window.removeEventListener('resize', updateViewportState);
        };
    }, []);

    return (
        <>
            {/* Koenig Plugins */}
            {!hidePlusMenu && <PlusCardMenuPlugin />}
            <SlashCardMenuPlugin />
        </>
    );
};

export default CardMenuPlugin;
