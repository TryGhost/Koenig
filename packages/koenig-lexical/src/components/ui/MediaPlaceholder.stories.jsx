import React from 'react';

import {MediaPlaceholder} from './MediaPlaceholder';

const story = {
    title: 'Generic/Media placeholder',
    component: MediaPlaceholder,
    argTypes: {
        icon: {
            options: ['image', 'gallery', 'video', 'audio', 'file', 'product'],
            control: {type: 'select'}
        },
        size: {
            options: ['xsmall', 'small', 'medium', 'large'],
            control: {type: 'select'}
        },
        borderStyle: {
            options: ['squared', 'rounded'],
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

const Template = args => (
    <div className="flex">
        <MediaPlaceholder {...args} />
    </div>
);

export const Image = Template.bind({});
Image.args = {
    icon: 'image',
    desc: 'Click to select an image',
    size: 'medium',
    borderStyle: 'squared'
};

export const Gallery = Template.bind({});
Gallery.args = {
    icon: 'gallery',
    desc: 'Click to select up to 9 images',
    size: 'large',
    borderStyle: 'squared'
};

export const Video = Template.bind({});
Video.args = {
    icon: 'video',
    desc: 'Click to select a video',
    size: 'medium',
    borderStyle: 'squared'
};

export const Audio = Template.bind({});
Audio.args = {
    icon: 'audio',
    desc: 'Click to upload an audio file',
    size: 'xsmall',
    borderStyle: 'squared'
};

export const File = Template.bind({});
File.args = {
    icon: 'file',
    desc: 'Click to upload a file',
    size: 'xsmall',
    borderStyle: 'squared'
};

export const Product = Template.bind({});
Product.args = {
    icon: 'product',
    desc: 'Click to upload a product image',
    size: 'small',
    borderStyle: 'squared'
};

export const Error = Template.bind({});
Error.args = {
    icon: 'video',
    desc: 'Click to select a video',
    size: 'medium',
    borderStyle: 'squared',
    errors: [{message: 'The file type you uploaded is not supported. Please use .MP4, .WEBM, .OGV'}]
};
