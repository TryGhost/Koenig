import React from 'react';
import ImageCard from '../../components/Cards/ImageCard/ImageCard';

const story = {
    title: 'Image Node',
    component: ImageCard
};
export default story;

const Template = args => <ImageCard {...args} />;

export const Default = Template.bind({});

