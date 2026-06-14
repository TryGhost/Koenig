// @ts-nocheck
import {ToolbarMenu} from './ToolbarMenu';
import {ToolbarMenuSeparator} from './ToolbarMenu';

import {Add} from './ToolbarMenuItem.stories';
import {Bold} from './ToolbarMenuItem.stories';
import {Edit} from './ToolbarMenuItem.stories';
import {HeadingThree} from './ToolbarMenuItem.stories';
import {HeadingTwo} from './ToolbarMenuItem.stories';
import {ImgFull} from './ToolbarMenuItem.stories';
import {ImgRegular} from './ToolbarMenuItem.stories';
import {ImgReplace} from './ToolbarMenuItem.stories';
import {ImgWide} from './ToolbarMenuItem.stories';
import {Italic} from './ToolbarMenuItem.stories';
import {Link} from './ToolbarMenuItem.stories';
import {Quote} from './ToolbarMenuItem.stories';
import {Snippet} from './ToolbarMenuItem.stories';

const story = {
    title: 'Toolbar/Toolbar',
    component: ToolbarMenu,
    subcomponents: {ToolbarMenuSeparator},
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template = (args) => {
    return (
        <div className="flex">
            <ToolbarMenu {...args} />
        </div>
    );
};

export const Text = Template.bind({});
Text.args = {
    children: [
        <Bold key='bold' {...Bold.args} />,
        <Italic key='italic' {...Italic.args} />,
        <HeadingTwo key='heading-two' {...HeadingTwo.args} />,
        <HeadingThree key='heading-three' {...HeadingThree.args} />,
        <ToolbarMenuSeparator key='sep-1' />,
        <Quote key='quote' {...Quote.args} />,
        <Link key='link' {...Link.args} />,
        <ToolbarMenuSeparator key='sep-2' />,
        <Snippet key='snippet' {...Snippet.args} />
    ]
};

export const Image = Template.bind({});
Image.args = {
    children: [
        <ImgRegular key='img-regular' {...ImgRegular.args} />,
        <ImgWide key='img-wide' {...ImgWide.args} />,
        <ImgFull key='img-full' {...ImgFull.args} />,
        <ToolbarMenuSeparator key='sep-1' />,
        <Link key='link' {...Link.args} />,
        <ImgReplace key='img-replace' {...ImgReplace.args} />,
        <ToolbarMenuSeparator key='sep-2' />,
        <Snippet key='snippet' {...Snippet.args} />
    ]
};

export const Gallery = Template.bind({});
Gallery.args = {
    children: [
        <Add key='add' {...Add.args} />,
        <ToolbarMenuSeparator key='sep-1' />,
        <Snippet key='snippet' {...Snippet.args} />
    ]
};

export const EditableCards = Template.bind({});
EditableCards.args = {
    children: [
        <Edit key='edit' {...Edit.args} />,
        <ToolbarMenuSeparator key='sep-1' />,
        <Snippet key='snippet' {...Snippet.args} />
    ]
};

export const NonEditableCards = Template.bind({});
NonEditableCards.args = {
    children: [
        <Snippet key='snippet' {...Snippet.args} />
    ]
};
