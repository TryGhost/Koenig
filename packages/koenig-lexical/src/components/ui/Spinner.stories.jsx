import React from 'react';
import {Spinner} from './Spinner';

const story = {
    title: 'Generic/Spinner',
    component: Spinner,
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template = args => (
    <Spinner {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const Mini = Template.bind({});
Mini.args = {
    size: 'mini'
};