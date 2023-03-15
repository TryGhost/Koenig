import React from 'react';
import {CardWrapper} from './../CardWrapper';
import {MarkdownCard} from './MarkdownCard.jsx';
import {ReactComponent as MarkdownIndicatorIcon} from '../../../assets/icons/kg-indicator-markdown.svg';
import {defaultHeaders} from '../../../../demo/utils/unsplashConfig';
import {useFileUpload} from '../../../../demo/utils/useFileUpload';

const unsplashConfig = {
    defaultHeaders
};

const displayOptions = {
    Default: {isSelected: false, isEditing: false},
    Selected: {isSelected: true, isEditing: false},
    Editing: {isSelected: true, isEditing: true}
};

function imageLoading() {
    return {progress: 60, isLoading: true, filesNumber: 2};
}

function imageErrors() {
    const errors = [
        {
            fileName: 'Image.jpg',
            message: 'The file type you uploaded is not supported.'
        }
    ];
    return {errors};
}

const story = {
    title: 'Primary cards/Markdown card',
    component: MarkdownCard,
    subcomponent: {CardWrapper},
    argTypes: {
        display: {
            options: Object.keys(displayOptions),
            mapping: displayOptions,
            control: {
                type: 'radio',
                labels: {
                    Default: 'Default',
                    Selected: 'Selected',
                    Editing: 'Editing'
                }
            }
        }
    },
    parameters: {
        status: {
            type: 'functional'

        }
    }
};
export default story;

const Template = ({display, ...args}) => (
    <div className="kg-prose">
        <div className="mx-auto my-8 min-w-[initial] max-w-[740px]">
            <CardWrapper IndicatorIcon={MarkdownIndicatorIcon} wrapperStyle='wide' {...display} {...args}>
                <MarkdownCard {...display} {...args} unsplashConf={unsplashConfig} />
            </CardWrapper>
        </div>
    </div>
);

export const Empty = Template.bind({});
Empty.args = {
    markdown: '',
    display: 'Editing',
    imageUploader: useFileUpload
};

export const Populated = Template.bind({});
Populated.args = {
    markdown: '**Bold** and *italic*',
    display: 'Editing',
    imageUploader: useFileUpload
};

export const Progress = Template.bind({});
Progress.args = {
    markdown: '**Bold** and *italic*',
    display: 'Editing',
    imageUploader: imageLoading
};

export const Errors = Template.bind({});
Errors.args = {
    markdown: '**Bold** and *italic*',
    display: 'Editing',
    imageUploader: imageErrors
};
