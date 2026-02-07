import PlusCardMenuPlugin from '../plugins/PlusCardMenuPlugin';
import React from 'react';
import SlashCardMenuPlugin from '../plugins/SlashCardMenuPlugin';

function isMobileViewport() {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.innerWidth < 768 && window.innerHeight > window.innerWidth;
}

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
