import React from 'react';
import PropTypes from 'prop-types';
import {MediaPlaceholder} from '../MediaPlaceholder';
import {Button} from './ButtonCard';
import {ReactComponent as ProductPlaceholderIcon} from '../../../assets/icons/kg-product-placeholder.svg';
import {ReactComponent as StarIcon} from '../../../assets/icons/kg-star.svg';

export function ProductCard({isSelected, image, title, titlePlaceholder, desc, descPlaceholder, button, buttonText, rating}) {
    return (
        <div className="flex w-full max-w-[550px] flex-col rounded border border-grey/40 p-4 font-sans">
            {(image && <div className="mb-4 h-[324px] w-full border border-grey-200 bg-grey-200"></div>) || (isSelected &&
                <div className="mb-4">
                    <MediaPlaceholder
                        desc="Click to select a product image"
                        Icon={ProductPlaceholderIcon}
                        size='small'
                    />
                </div>)
            } 
            <div className="flex items-start justify-between">
                {(title || isSelected) && <h3 className={`text-xl font-bold leading-snug text-black ${title || 'opacity-40'}`}>{title || titlePlaceholder}</h3>}
                {rating && 
                    <div className="flex fill-grey-900 transition-all duration-75 hover:fill-grey-800">
                        <RatingButton />
                    </div>
                }
            </div>
            {(desc || isSelected) && <p className={`mt-2 text-[1.6rem] font-normal leading-snug text-grey-700 ${desc || 'opacity-50'}`}>{desc || descPlaceholder}</p>}
            {(button && (isSelected || buttonText)) && 
                <div className="mt-6 w-full">
                    <Button width='full' value={buttonText} />
                </div>
            }
        </div>
    );
}

function RatingButton() {
    const n = 5;
    return (
        [...Array(n)].map(i => <button className="flex h-7 w-5 items-center justify-center" key={i}><StarIcon /></button>)
    );
}

ProductCard.propTypes = {
    isSelected: PropTypes.bool,
    image: PropTypes.bool,
    title: PropTypes.string,
    titlePlaceholder: PropTypes.string,
    desc: PropTypes.string,
    descPlaceholder: PropTypes.string,
    button: PropTypes.bool,
    buttonText: PropTypes.string,
    rating: PropTypes.bool
};