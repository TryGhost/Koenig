import React from 'react';
import populateEditor from '../../../utils/storybook/populate-storybook-editor';
import {CardWrapper} from './../CardWrapper';
import {ImageCard} from './ImageCard';
import {MINIMAL_NODES} from '../../../index.js';
import {createEditor} from 'lexical';

const displayOptions = {
    Default: {isSelected: false, isEditing: false},
    Selected: {isSelected: true, isEditing: false}
};

const story = {
    title: 'Primary cards/Image card',
    component: ImageCard,
    subcomponent: {CardWrapper},
    argTypes: {
        display: {
            options: Object.keys(displayOptions),
            mapping: displayOptions,
            control: {
                type: 'radio',
                labels: {
                    Default: 'Default',
                    Selected: 'Selected'
                },
                defaultValue: displayOptions.Default
            }
        },
        cardWidth: {
            options: ['regular', 'wide', 'full'],
            control: {type: 'radio'}
        }
    },
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template = ({display, caption, ...args}) => {
    const captionEditor = createEditor({nodes: MINIMAL_NODES});
    populateEditor({editor: captionEditor, initialHtml: `<p>${caption}</p>`});

    return (
        <div className="kg-prose">
            <div className="mx-auto my-8 min-w-[initial] max-w-[740px]">
                <CardWrapper {...display} {...args}>
                    <ImageCard {...display} {...args} captionEditor={captionEditor} />
                </CardWrapper>
            </div>
        </div>
    );
};

export const Empty = Template.bind({});
Empty.args = {
    display: 'Selected',
    setAltText: true,
    caption: '',
    altText: '',
    imageUploader: {
        isLoading: false,
        progress: 100
    },
    imageFileDragHandler: {
        isDraggedOver: false
    }
};

export const Uploading = Template.bind({});
Uploading.args = {
    display: 'Selected',
    cardWidth: 'regular',
    setAltText: true,
    caption: '',
    altText: '',
    isDraggedOver: false,
    previewSrc: 'https://static.ghost.org/v4.0.0/images/feature-image.jpg',
    imageUploader: {
        progress: 50,
        isLoading: true
    },
    imageFileDragHandler: {
        isDraggedOver: false
    }
};

export const Populated = Template.bind({});
Populated.args = {
    display: 'Selected',
    cardWidth: 'regular',
    src: 'https://static.ghost.org/v4.0.0/images/feature-image.jpg',
    setAltText: true,
    caption: 'Welcome to your new Ghost publication',
    altText: 'Feature image',
    imageUploader: {
        isLoading: false,
        progress: 100
    },
    imageFileDragHandler: {
        isDraggedOver: false
    }
};

export const Errors = Template.bind({});
Errors.args = {
    display: 'Selected',
    cardWidth: 'regular',
    setAltText: true,
    caption: '',
    altText: '',
    imageUploader: {
        errors: [{message: 'The file type you uploaded is not supported. Please use .GIF, .JPG, .JPEG, .PNG, .SVG, .SVGZ, .WEBP'}]
    },
    imageFileDragHandler: {
        isDraggedOver: false
    }
};

export const DraggedOver = Template.bind({});
DraggedOver.args = {
    display: 'Selected',
    cardWidth: 'regular',
    setAltText: true,
    caption: '',
    altText: '',
    imageUploader: {
        errors: [{message: 'The file type you uploaded is not supported. Please use .GIF, .JPG, .JPEG, .PNG, .SVG, .SVGZ, .WEBP'}]
    },
    imageFileDragHandler: {
        isDraggedOver: true
    }
};
