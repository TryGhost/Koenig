import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

export function VisibilityTooltipPortal({children, label}) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({top: 0, left: 0});
    const triggerRef = useRef(null);

    const updatePosition = () => {
        if (triggerRef.current) {
            // Find the SVG element within the trigger
            const indicator = triggerRef.current.querySelector('[data-kg-card-visibility-indicator-wrapper]');
            if (indicator) {
                const rect = indicator.getBoundingClientRect();
                setPosition({
                    top: window.scrollY + rect.top - 37, // Position above the indicator
                    left: window.scrollX + rect.left + (rect.width / 2) // Center horizontally
                });
            }
        }
    };

    useEffect(() => {
        if (isVisible) {
            updatePosition();
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible]);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
            {isVisible && createPortal(
                <div
                    className="absolute z-[1000] rounded-md bg-black p-2 font-sans text-2xs font-medium text-white dark:bg-grey-900"
                    data-testid="visibility-tooltip"
                    style={{
                        top: position.top,
                        left: position.left,
                        transform: 'translateX(-50%)'
                    }}
                >
                    {label}
                </div>,
                document.querySelector('.koenig-lexical')
            )}
        </>
    );
} 