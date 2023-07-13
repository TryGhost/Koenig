import React from 'react';
import populateEditor from '../../../utils/storybook/populate-storybook-editor';
import {CardWrapper} from './../CardWrapper';
import {MINIMAL_NODES} from '../../../index.js';
import {VideoCard} from './VideoCard';
import {createEditor} from 'lexical';

const displayOptions = {
    Default: {isSelected: false, isEditing: false},
    Selected: {isSelected: true, isEditing: false},
    Editing: {isSelected: true, isEditing: true}
};

const story = {
    title: 'Primary cards/Video card',
    component: VideoCard,
    subcomponent: {CardWrapper},
    argTypes: {
        display: {
            options: Object.keys(displayOptions),
            mapping: displayOptions,
            control: {
                type: 'radio',
                labels: {
                    Default: 'Default',
                    Selected: 'Selected',
                    Editing: 'Editing'
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
            <div className="not-kg-prose mx-auto my-8 min-w-[initial] max-w-[740px]">
                <CardWrapper {...display} {...args}>
                    <VideoCard {...display} {...args} captionEditor={captionEditor} />
                </CardWrapper>
            </div>
        </div>
    );
};

export const Empty = Template.bind({});
Empty.args = {
    display: 'Editing',
    caption: ''
};

export const Uploading = Template.bind({});
Uploading.args = {
    display: 'Editing',
    cardWidth: 'regular',
    thumbnail: 'https://static.ghost.org/v5.0.0/images/publication-cover.jpg',
    customThumbnail: '',
    totalDuration: '32:27',
    caption: '',
    videoUploader: {
        isLoading: true,
        progress: 60
    }
};

export const DraggedOver = Template.bind({});
DraggedOver.args = {
    display: 'Editing',
    cardWidth: 'regular',
    thumbnail: '',
    customThumbnail: '',
    caption: '',
    videoDragHandler: {
        isDraggedOver: true
    }
};

export const Populated = Template.bind({});
Populated.args = {
    display: 'Editing',
    cardWidth: 'regular',
    isLoopChecked: false,
    thumbnail: 'https://static.ghost.org/v5.0.0/images/publication-cover.jpg',
    customThumbnail: '',
    totalDuration: '32:27',
    caption: 'Watch the full documentary here.'
};

export const Error = Template.bind({});
Error.args = {
    display: 'Editing',
    cardWidth: 'regular',
    thumbnail: '',
    customThumbnail: '',
    totalDuration: '32:27',
    caption: '',
    videoUploadErrors: [{message: 'The file type you uploaded is not supported. Please use .MP4, .WEBM, .OGV'}]
};

export const ThumbnailUploading = Template.bind({});
ThumbnailUploading.args = {
    display: 'Editing',
    cardWidth: 'regular',
    thumbnail: 'https://static.ghost.org/v5.0.0/images/publication-cover.jpg',
    customThumbnail: '',
    totalDuration: '32:27',
    caption: 'Watch the full documentary here.',
    customThumbnailUploader: {
        isLoading: true,
        progress: 60
    }
};

export const ThumbnailDraggedOver = Template.bind({});
ThumbnailDraggedOver.args = {
    display: 'Editing',
    cardWidth: 'regular',
    thumbnail: 'https://static.ghost.org/v5.0.0/images/publication-cover.jpg',
    customThumbnail: '',
    totalDuration: '32:27',
    caption: 'Watch the full documentary here.',
    thumbnailDragHandler: {
        isDraggedOver: true
    }
};

export const ThumbnailPopulated = Template.bind({});
ThumbnailPopulated.args = {
    display: 'Editing',
    cardWidth: 'regular',
    isLoopChecked: false,
    thumbnail: 'https://static.ghost.org/v5.0.0/images/publication-cover.jpg',
    customThumbnail: 'https://images.unsplash.com/photo-1543242594-c8bae8b9e708?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80',
    totalDuration: '32:27',
    caption: 'Watch the full documentary here.'
};

export const ThumbnailError = Template.bind({});
ThumbnailError.args = {
    display: 'Editing',
    cardWidth: 'regular',
    isLoopChecked: false,
    thumbnail: 'https://static.ghost.org/v5.0.0/images/publication-cover.jpg',
    customThumbnail: '',
    totalDuration: '32:27',
    caption: 'Watch the full documentary here.',
    customThumbnailUploader: {
        errors: [{message: 'This file type is not supported. Please use .GIF, .JPG, .JPEG, .PNG, .SVG, .SVGZ, .WEBP'}]
    }
};

