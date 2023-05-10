import React from 'react';

import {ToolbarMenuItem} from './ToolbarMenu';

const story = {
    title: 'Toolbar/Toolbar buttons',
    component: ToolbarMenuItem,
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template = (args) => {
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
    icon: 'bold'
};

export const Italic = Template.bind({});
Italic.args = {
    icon: 'italic'
};

export const HeadingOne = Template.bind({});
HeadingOne.args = {
    icon: 'headingOne'
};

export const HeadingTwo = Template.bind({});
HeadingTwo.args = {
    icon: 'headingTwo'
};

export const Quote = Template.bind({});
Quote.args = {
    icon: 'quote'
};

export const QuoteOne = Template.bind({});
QuoteOne.args = {
    icon: 'quoteOne'
};

export const QuoteTwo = Template.bind({});
QuoteTwo.args = {
    icon: 'quoteTwo'
};

export const Link = Template.bind({});
Link.args = {
    icon: 'link'
};

export const ImgRegular = Template.bind({});
ImgRegular.args = {
    icon: 'imgRegular'
};

export const ImgWide = Template.bind({});
ImgWide.args = {
    icon: 'imgWide'
};

export const ImgFull = Template.bind({});
ImgFull.args = {
    icon: 'imgFull'
};

export const ImgReplace = Template.bind({});
ImgReplace.args = {
    icon: 'imgReplace'
};

export const Add = Template.bind({});
Add.args = {
    icon: 'add'
};

export const Edit = Template.bind({});
Edit.args = {
    icon: 'edit'
};

export const Snippet = Template.bind({});
Snippet.args = {
    icon: 'snippet'
};