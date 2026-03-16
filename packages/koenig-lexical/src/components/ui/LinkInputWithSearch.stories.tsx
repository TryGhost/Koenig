import {LinkInputWithSearch} from './LinkInputWithSearch';
import type {Meta, StoryFn} from '@storybook/react-vite';

const story: Meta<typeof LinkInputWithSearch> = {
    title: 'Toolbar/LinkInputWithSearch',
    component: LinkInputWithSearch,
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template: StoryFn<typeof LinkInputWithSearch> = (args) => {
    return (
        <div className="flex">
            <LinkInputWithSearch {...args} />
        </div>
    );
};

export const Empty = Template.bind({});
Empty.args = {
    href: ''
};

export const Populated = Template.bind({});
Populated.args = {
    href: 'https://ghost.org'
};
