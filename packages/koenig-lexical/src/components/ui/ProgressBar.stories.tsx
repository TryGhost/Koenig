import {ProgressBar} from './ProgressBar';
import type {Meta, StoryFn} from '@storybook/react-vite';

const story: Meta<typeof ProgressBar> = {
    title: 'Generic/Progress bar',
    component: ProgressBar,
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template: StoryFn<typeof ProgressBar> = args => (
    <ProgressBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
    style: {width: 60 + '%'},
    fullWidth: false
};