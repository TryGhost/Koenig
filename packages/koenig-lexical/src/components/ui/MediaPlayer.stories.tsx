import {MediaPlayer} from './MediaPlayer';
import type {Meta, StoryFn} from '@storybook/react-vite';

const story: Meta<typeof MediaPlayer> = {
    title: 'Generic/Media player',
    component: MediaPlayer,
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template: StoryFn<typeof MediaPlayer> = args => (
    <MediaPlayer {...args} />
);

export const Default = Template.bind({});
Default.args = {
    theme: 'dark'
};