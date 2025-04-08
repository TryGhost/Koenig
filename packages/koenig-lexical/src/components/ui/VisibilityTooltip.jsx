import Portal from './Portal';
import React, {useRef, useState} from 'react';

export function VisibilityTooltip({children, label}) {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef(null);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const getTooltipPosition = () => {
        if (!triggerRef.current) {
            return {top: 0, left: 0};
        }

        const indicator = triggerRef.current.querySelector('[data-testid="visibility-indicator"]');
        if (!indicator) {
            return {top: 0, left: 0};
        }

        const rect = indicator.getBoundingClientRect();
        return {
            top: rect.top - 30, // Position above the indicator
            left: rect.left + (rect.width / 2) // Center horizontally on the indicator
        };
    };

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
            {isVisible && (
                <Portal>
                    <div
                        className="fixed z-[1000] flex items-center gap-1 whitespace-nowrap rounded-md bg-black px-[1rem] py-1 font-sans text-2xs font-medium text-white dark:bg-grey-900"
                        data-testid="visibility-tooltip"
                        style={{
                            top: getTooltipPosition().top,
                            left: getTooltipPosition().left,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        {label}
                    </div>
                </Portal>
            )}
        </>
    );
} 