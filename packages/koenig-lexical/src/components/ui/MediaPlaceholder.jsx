import AudioPlaceholderIcon from '../../assets/icons/kg-audio-placeholder.svg?react';
import FilePlaceholderIcon from '../../assets/icons/kg-file-placeholder.svg?react';
import GalleryPlaceholderIcon from '../../assets/icons/kg-gallery-placeholder.svg?react';
import ImgPlaceholderIcon from '../../assets/icons/kg-img-placeholder.svg?react';
import ProductPlaceholderIcon from '../../assets/icons/kg-product-placeholder.svg?react';
import PropTypes from 'prop-types';
import React from 'react';
import VideoPlaceholderIcon from '../../assets/icons/kg-video-placeholder.svg?react';
import clsx from 'clsx';

export const PLACEHOLDER_ICONS = {
    image: ImgPlaceholderIcon,
    gallery: GalleryPlaceholderIcon,
    video: VideoPlaceholderIcon,
    audio: AudioPlaceholderIcon,
    file: FilePlaceholderIcon,
    product: ProductPlaceholderIcon
};

export const CardText = ({text, type}) => (
    <span 
        className={clsx(
            'text-center font-sans text-sm font-semibold text-grey-800 transition-all group-hover:text-grey-800',
            type === 'button' && 'px-3 py-1'
        )}
        data-kg-card-drag-text
    >
        {text}
    </span>
);

export function MediaPlaceholder({
    desc,
    icon,
    filePicker,
    size,
    type,
    borderStyle,
    isDraggedOver,
    errors = [],
    placeholderRef,
    dataTestId = 'media-placeholder',
    errorDataTestId = 'media-placeholder-errors',
    multiple = false,
    ...props
}) {
    const Icon = PLACEHOLDER_ICONS[icon];

    const containerClasses = clsx(
        'relative flex h-full items-center justify-center',
        type === 'button' ? 'rounded-lg bg-grey-100' : 'border bg-grey-50',
        size === 'xsmall' && type !== 'button' && 'before:pb-[12.5%] dark:bg-grey-900',
        size !== 'xsmall' && type !== 'button' && 'before:pb-[62.5%] dark:bg-grey-950',
        borderStyle === 'rounded' && type !== 'button' && 'rounded-lg border-grey/20 dark:border-transparent',
        borderStyle !== 'rounded' && type !== 'button' && 'border-grey/20 dark:border-grey/10'
    );

    const iconClasses = clsx(
        'shrink-0 opacity-80 transition-all ease-linear hover:scale-105 group-hover:opacity-100',
        size === 'large' && 'size-20 text-grey',
        size === 'small' && 'size-14 text-grey',
        size === 'xsmall' && 'size-5 text-grey-700',
        !['large', 'small', 'xsmall'].includes(size) && 'size-16 text-grey',
        (size === 'xsmall' && desc) && 'mr-3'
    );

    const descriptionClasses = clsx(
        'flex min-w-[auto] !font-sans !text-sm !font-normal text-grey-700 opacity-80 transition-all group-hover:opacity-100',
        size === 'xsmall' && '!mt-0',
        size !== 'xsmall' && '!mt-4'
    );

    const buttonClasses = clsx(
        'group flex cursor-pointer select-none items-center justify-center',
        size === 'xsmall' && 'p-4',
        size !== 'xsmall' && 'flex-col p-20'
    );

    const errorClasses = clsx(
        'font-sans text-sm font-semibold text-red',
        size !== 'xsmall' && 'mt-3 max-w-[65%]'
    );

    return (
        <div
            ref={placeholderRef}
            className="not-kg-prose size-full"
            {...props}
            data-testid={dataTestId}
        >
            <div className={containerClasses}>
                {isDraggedOver ? (
                    <CardText text={`Drop ${multiple ? '\'em' : 'it'} like it's hot 🔥`} type={type} />
                ) : (
                    <>
                        {type === 'button' ? (
                            <button 
                                className="group flex cursor-pointer select-none items-center justify-center px-3 py-1" 
                                name="placeholder-button" 
                                type="button" 
                                onClick={filePicker}
                            >
                                {!errors.length && (
                                    <p className="!font-sans !text-[1.3rem] !font-medium text-grey-900">{desc}</p>
                                )}
                                {errors.map(error => (
                                    <span
                                        key={error.message}
                                        className={errorClasses}
                                        data-testid={errorDataTestId}
                                    >
                                        {error.message}
                                    </span>
                                ))}
                            </button>
                        ) : (
                            <button 
                                className={buttonClasses}
                                name="placeholder-button" 
                                type="button" 
                                onClick={filePicker}
                            >
                                {!(size === 'xsmall' && errors.length > 0) && (
                                    <>
                                        <Icon className={iconClasses} />
                                        <p className={descriptionClasses}>{desc}</p>
                                    </>
                                )}
                                {errors.map(error => (
                                    <span
                                        key={error.message}
                                        className={errorClasses}
                                        data-testid={errorDataTestId}
                                    >
                                        {error.message}
                                    </span>
                                ))}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

MediaPlaceholder.propTypes = {
    icon: PropTypes.oneOf(['image', 'gallery', 'video', 'audio', 'file', 'product']),
    desc: PropTypes.string,
    size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
    type: PropTypes.oneOf(['image', 'button']),
    borderStyle: PropTypes.oneOf(['squared', 'rounded'])
};
