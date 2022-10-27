import React from 'react';
import {HeaderCard} from './HeaderCard';
import {CardWrapper} from './../CardWrapper';

const story = {
    title: 'Cards/Header Card',
    component: HeaderCard,
    subcomponent: {CardWrapper},
    argTypes: {
        isSelected: {control: 'boolean'}
    }
};
export default story;

const Template = args => (
    <div className="w-full">
        <CardWrapper {...args}>
            <HeaderCard {...args} />
        </CardWrapper>
    </div>
);

export const Empty = Template.bind({});
Empty.args = {
    isSelected: true,
    size: 'small',
    backgroundColor: 'dark',
    heading: '',
    headingPlaceholder: 'Enter heading text',
    subHeading: '',
    subHeadingPlaceholder: 'Enter subheading text',
    button: false,
    buttonText: '',
    buttonPlaceholder: 'Add button text'
};

export const Populated = Template.bind({});
Populated.args = {
    isSelected: true,
    size: 'small',
    backgroundColor: 'dark',
    heading: 'This is a heading',
    headingPlaceholder: 'Enter heading text',
    subHeading: 'And here is some subheading text.',
    subHeadingPlaceholder: 'Enter subheading text',
    button: false,
    buttonText: 'Subscribe',
    buttonPlaceholder: 'Add button text'
};

