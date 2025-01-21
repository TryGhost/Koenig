import EmailIndicatorIcon from '../../../assets/icons/kg-indicator-email.svg?react';
import React from 'react';
import populateEditor from '../../../utils/storybook/populate-storybook-editor.js';
import {BASIC_NODES} from '../../../index.js';
import {CardWrapper} from './../CardWrapper';
import {CtaCard} from './CtaCard';
import {createEditor} from 'lexical';

const displayOptions = {
    Default: {isSelected: false, isEditing: false},
    Selected: {isSelected: true, isEditing: false},
    Editing: {isSelected: true, isEditing: true}
};

const layoutOptions = {
    Minimal: 'minimal',
    Immersive: 'immersive'
};

const story = {
    title: 'Primary cards/CTA card',
    component: CtaCard,
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
                },
                defaultValue: displayOptions.Default
            },
            layout: {
                options: Object.keys(layoutOptions),
                mapping: layoutOptions,
                control: {
                    type: 'radio',
                    labels: {
                        Minimal: 'Minimal',
                        Immersive: 'Immersive'
                    }
                }
            }
        }
    },
    parameters: {
        status: {
            type: 'uiReady'
        }
    }
};
export default story;

const Template = ({display, value, ...args}) => {
    const htmlEditor = createEditor({nodes: BASIC_NODES});
    populateEditor({editor: htmlEditor, initialHtml: `${value}`});
    return (
        <div>
            <div className="kg-prose">
                <div className="mx-auto my-8 min-w-[initial] max-w-[740px]">
                    <CardWrapper 
                        IndicatorIcon={EmailIndicatorIcon} 
                        {...(args.color === 'none' && {wrapperStyle: 'wide'})} 
                        {...display} 
                        {...args}
                    >
                        <CtaCard {...display} {...args} htmlEditor={htmlEditor} />
                    </CardWrapper>
                </div>
            </div>
            {/* <div className="kg-prose dark bg-black px-4 py-8">
                <div className="mx-auto my-8 min-w-[initial] max-w-[740px]">
                    <CardWrapper 
                        IndicatorIcon={EmailIndicatorIcon} 
                        {...(args.color === 'none' && {wrapperStyle: 'wide'})} 
                        {...display} 
                        {...args}
                    >
                        <CtaCard {...display} {...args} htmlEditor={htmlEditor} />
                    </CardWrapper>
                </div>
            </div> */}
        </div>
    );
};

export const Empty = Template.bind({});
Empty.args = {
    display: 'Editing',
    value: '',
    showButton: false,
    hasImage: false,
    hasSponsorLabel: false,
    color: 'green',
    layout: 'immersive',
    buttonText: '',
    buttonUrl: '',
    suggestedUrls: []
};

export const Populated = Template.bind({});
Populated.args = {
    display: 'Editing',
    value: 'Introducing the Air Stride 90X – where bold design meets unmatched performance. Engineered for ultimate support and breathability, it’s the perfect companion for your active lifestyle. Step up your game, in style.',
    showButton: true,
    hasImage: true,
    hasSponsorLabel: true,
    color: 'green',
    layout: 'immersive',
    buttonText: 'Grab 20% discount',
    buttonUrl: 'https://ghost.org/',
    suggestedUrls: [{label: 'Homepage', value: 'https://localhost.org/'}]
};

