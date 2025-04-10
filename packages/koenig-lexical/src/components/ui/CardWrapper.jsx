import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import VisibilityIndicator from '../../assets/icons/kg-indicator-visibility.svg?react';
import {VisibilityTooltip} from './VisibilityTooltip';
import {getVisibilityLabel, parseVisibilityToToggles} from '../../utils/visibility';

const CARD_WIDTH_CLASSES = {
    wide: [
        'w-[calc(75vw-var(--kg-breakout-adjustment-with-fallback)+2px)] mx-[calc(50%-(50vw-var(--kg-breakout-adjustment-with-fallback))-.8rem)] min-w-[calc(100%+3.6rem)] translate-x-[calc(50vw-50%+.8rem-var(--kg-breakout-adjustment-with-fallback))]',
        'md:min-w-[calc(100%+10rem)]',
        'lg:min-w-[calc(100%+18rem)]'
    ].join(' '),
    full: 'inset-x-[-1px] mx-[calc(50%-50vw)] w-[calc(100vw+2px)] lg:mx-[calc(50%-50vw+(var(--kg-breakout-adjustment-with-fallback)/2))] lg:w-[calc(100vw-var(--kg-breakout-adjustment-with-fallback)+2px)]'
};

const DEFAULT_INDICATOR_POSITION = {
    top: '1.6rem'
};

const CARD_TYPE_TOP_POSITIONS = {
    'call-to-action': '1.6rem',
    html: '0.5rem'
};

const CARD_TYPE_LEFT_POSITIONS = {
    signup: '-36rem'
};

export const CardWrapper = React.forwardRef(({
    cardType,
    cardWidth = 'regular',
    feature,
    IndicatorIcon,
    indicatorPosition = DEFAULT_INDICATOR_POSITION,
    isDragging,
    isEditing,
    isSelected,
    isVisibilityActive,
    onIndicatorClick,
    wrapperStyle,
    children,
    nodeKey,
    visibilitySegment,
    ...props
}, ref) => {
    const [indicatorLeft, setIndicatorLeft] = useState('-6rem');
    const [indicatorTop, setIndicatorTop] = useState(CARD_TYPE_TOP_POSITIONS[cardType] || indicatorPosition.top);

    useEffect(() => {
        if (!ref?.current) {
            return;
        }

        const updatePosition = () => {
            const card = ref.current;
            if (!card) {
                return;
            }

            if (cardWidth === 'full') {
                setIndicatorLeft('0');
                setIndicatorTop('0.2rem');
                return;
            }

            if (cardWidth === 'wide') {
                setIndicatorLeft(CARD_TYPE_LEFT_POSITIONS[cardType] || '-36rem');
                return;
            }

            if (cardWidth === 'regular') {
                setIndicatorLeft('-6rem');
                setIndicatorTop(CARD_TYPE_TOP_POSITIONS[cardType] || indicatorPosition.top);
                return;
            }

            const cardRect = card.getBoundingClientRect();
            const container = card.closest('[data-lexical-editor]');
            const containerRect = container?.getBoundingClientRect();

            if (containerRect) {
                const left = cardRect.left - containerRect.left - 96; // 6rem in pixels
                setIndicatorLeft(`${left}px`);
                setIndicatorTop(CARD_TYPE_TOP_POSITIONS[cardType] || indicatorPosition.top);
            }
        };

        const card = ref.current;
        const container = card.closest('[data-lexical-editor]');

        if (!container) {
            return;
        }

        const observer = new ResizeObserver(updatePosition);
        observer.observe(card);
        observer.observe(container);

        // Initial position update
        updatePosition();

        return () => {
            observer.disconnect();
        };
    }, [ref, cardWidth, indicatorPosition.top, cardType]);

    const wrapperClass = () => {
        if ((wrapperStyle === 'wide') && (isEditing || isSelected)) {
            return '!-mx-3 !px-3';
        } else if (((wrapperStyle === 'code-card') && isEditing)) {
            return '-mx-6';
        } else if (wrapperStyle === 'wide') {
            return 'hover:-mx-3 hover:px-3';
        } else {
            return 'border';
        }
    };

    const className = [
        'relative border-transparent caret-grey-800',
        isSelected ? 'z-20' : 'z-10', // ensure setting panels sit above other cards
        isSelected && !isDragging ? 'shadow-[0_0_0_2px] shadow-green' : '',
        !isSelected && !isDragging ? 'hover:shadow-[0_0_0_1px] hover:shadow-green' : '',
        CARD_WIDTH_CLASSES[cardWidth] || '',
        wrapperClass()
    ].join(' ');

    let visibilityLabel = false;
    if (isVisibilityActive) {
        const toggles = parseVisibilityToToggles(visibilitySegment);
        visibilityLabel = getVisibilityLabel(toggles, cardType);
    }

    let indicatorIcon;
    if (isVisibilityActive) {
        indicatorIcon = (
            <div className="relative">
                <VisibilityTooltip label={visibilityLabel}>
                    <div className="absolute" data-kg-visibility-text={visibilitySegment} data-testid="visibility-indicator-wrapper" style={{
                        left: indicatorLeft,
                        top: indicatorTop
                    }} data-kg-card-visibility-indicator-wrapper>
                        <VisibilityIndicator
                            aria-label="Card is hidden for select audiences"
                            className="size-5 cursor-pointer text-grey"
                            data-testid="visibility-indicator"
                            onClick={onIndicatorClick}
                        />
                    </div>
                </VisibilityTooltip>
            </div>
        );
    } else if (IndicatorIcon) {
        indicatorIcon = (
            <div className="relative">
                <IndicatorIcon
                    aria-label={`${cardType} indicator`}
                    className="absolute size-5 text-grey"
                    style={{
                        left: indicatorLeft,
                        top: indicatorTop
                    }}
                />
            </div>
        );
    }

    return (
        <>
            {indicatorIcon}
            <div
                ref={ref}
                className={className}
                data-kg-card={cardType}
                data-kg-card-editing={isEditing}
                data-kg-card-selected={isSelected}
                {...props}
            >
                {children}
            </div>
        </>
    );
});

CardWrapper.displayName = 'CardWrapper';

CardWrapper.propTypes = {
    isSelected: PropTypes.bool,
    isEditing: PropTypes.bool,
    cardWidth: PropTypes.oneOf(['regular', 'wide', 'full']),
    icon: PropTypes.string,
    indicatorPosition: PropTypes.shape({
        left: PropTypes.string,
        top: PropTypes.string
    }),
    visibility: PropTypes.func
};
