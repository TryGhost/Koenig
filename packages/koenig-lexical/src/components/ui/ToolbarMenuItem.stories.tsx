import React from 'react';
import type {Meta, StoryFn} from '@storybook/react-vite';

import {ToolbarMenuItem} from './ToolbarMenu';

const story: Meta<typeof ToolbarMenuItem> = {
    title: 'Toolbar/Toolbar buttons',
    component: ToolbarMenuItem,
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template: StoryFn<typeof ToolbarMenuItem> = (args) => {
    const [isActive, setActive] = React.useState(false);
    return (
        <div className="flex">
            <div className="rounded bg-black">
                <ToolbarMenuItem {...args} isActive={isActive} onClick={() => setActive(!isActive)} />
            </div>
        </div>
    );
};

export const Bold = Template.bind({});
Bold.args = {
    icon: 'bold',
    label: 'Bold'
};

export const Italic = Template.bind({});
Italic.args = {
    icon: 'italic',
    label: 'Italic'
};

export const HeadingTwo = Template.bind({});
HeadingTwo.args = {
    icon: 'headingTwo',
    label: 'Heading 2'
};

export const HeadingThree = Template.bind({});
HeadingThree.args = {
    icon: 'headingThree',
    label: 'Heading 3'
};

export const Quote = Template.bind({});
Quote.args = {
    icon: 'quote',
    label: 'Quote'
};

export const QuoteOne = Template.bind({});
QuoteOne.args = {
    icon: 'quoteOne',
    label: 'Quote'
};

export const QuoteTwo = Template.bind({});
QuoteTwo.args = {
    icon: 'quoteTwo',
    label: 'Quote'
};

export const Link = Template.bind({});
Link.args = {
    icon: 'link',
    label: 'Link'
};

export const ImgRegular = Template.bind({});
ImgRegular.args = {
    icon: 'imgRegular',
    label: 'Regular'
};

export const ImgWide = Template.bind({});
ImgWide.args = {
    icon: 'imgWide',
    label: 'Wide'
};

export const ImgFull = Template.bind({});
ImgFull.args = {
    icon: 'imgFull',
    label: 'Full size'
};

export const ImgReplace = Template.bind({});
ImgReplace.args = {
    icon: 'imgReplace',
    label: 'Replace'
};

export const Add = Template.bind({});
Add.args = {
    icon: 'add',
    label: 'Add'
};

export const Edit = Template.bind({});
Edit.args = {
    icon: 'edit',
    label: 'Edit'
};

export const Snippet = Template.bind({});
Snippet.args = {
    icon: 'snippet',
    label: 'Snippet'
};