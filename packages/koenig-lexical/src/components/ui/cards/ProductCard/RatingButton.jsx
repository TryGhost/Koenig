import React from 'react';
import StarIcon from '../../../../assets/icons/kg-star.svg?react';

export function RatingButton({rating, onRatingChange}) {
    const [hoveredStarIndex, setHoveredStarIndex] = React.useState(-1);

    const resetHoveredStarIndex = () => {
        setHoveredStarIndex(-1);
    };

    const getStyles = (index) => {
        const styles = {
            active: rating >= (index + 1) ? 'fill-grey-900 dark:fill-white' : 'fill-grey-200 dark:fill-grey-900',
            hovered: hoveredStarIndex >= index ? 'opacity-70' : ''
        };

        return Object.values(styles).join(' ');
    };

    return (
        // The rating widget sits above the card's ReadOnlyOverlay (z-10) and
        // opts out of the wrapper's mousedown preventDefault via
        // `data-kg-allow-clickthrough`, so clicking a star always reaches the
        // button regardless of the card's editing state.
        <div
            className="not-kg-prose relative z-20 ml-auto flex transition-all duration-75"
            data-testid="product-stars"
            data-kg-allow-clickthrough
            onMouseLeave={resetHoveredStarIndex}
        >
            {
                [...Array(5).keys()].map((star, i) => (
                    <button
                        key={star}
                        className={`flex h-7 w-5 cursor-pointer items-center justify-center ${getStyles(i)}`}
                        type="button"
                        onClick={() => onRatingChange(i + 1)}
                        onMouseOver={() => setHoveredStarIndex(i)}
                    >
                        <StarIcon className="w-4" />
                    </button>
                ))
            }
        </div>
    );
}
