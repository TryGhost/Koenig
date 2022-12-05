import React from 'react';
import UnsplashSelector from './UnsplashSelector';
// import {GalleryLayout, MasonryColumn} from '../Unsplash/UnsplashGallery';

const story = {
    title: 'File Selectors/Unsplash',
    component: UnsplashSelector
};
export default story;
const Template = (args) => {
    return (
        <div className="w-full">
            <UnsplashSelector {...args}>
                
            </UnsplashSelector>
        </div>
    );
}; 

export const Gallery = Template.bind({});
Gallery.args = {
    zoomed: false,
    isLoading: false,
    selectImg: () => {},
    insertImage: () => {},
    closeModal: () => {}
};

// export const Zoomed = Template.bind({});
// Zoomed.args = {};
