import GifSelector from './GifSelector';
import {getGifProviderConfig, useGif} from '../../utils/services/gif';
import {tenorConfig} from '../../../demo/utils/gifConfig';
import type {Meta, StoryFn} from '@storybook/react-vite';

const story: Meta<typeof GifSelector> = {
    title: 'File Selectors/Gif',
    component: GifSelector,
    parameters: {
        status: {
            type: 'Functional'
        }
    }
};
export default story;

const Template: StoryFn<typeof GifSelector> = (args) => {
    const gifHook = useGif({config: getGifProviderConfig({tenor: tenorConfig})!});

    return (
        <GifSelector {...gifHook} {...args} />
    );
};

export const Base = Template.bind({});
Base.args = {};

export const Loading = Template.bind({});
Loading.args = {
    isLoading: true,
    isLazyLoading: false
};

export const LazyLoading = Template.bind({});
LazyLoading.args = {
    isLoading: true,
    isLazyLoading: true,
    loadNextPage: () => {}
};

export const ErrorCommon = Template.bind({});
ErrorCommon.args = {
    error: 'common'
};

export const ErrorInvalidKey = Template.bind({});
ErrorInvalidKey.args = {
    error: 'invalid_key'
};

export const ErrorSpecific = Template.bind({});
ErrorSpecific.args = {
    error: 'Something went wrong'
};
