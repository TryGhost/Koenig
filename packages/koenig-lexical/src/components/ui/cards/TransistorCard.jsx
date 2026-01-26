import PropTypes from 'prop-types';
import React, {useState} from 'react';
import TransistorIcon from '../../../assets/icons/kg-card-type-transistor.svg?react';
import {ColorPickerSetting, SettingsPanel} from '../SettingsPanel.jsx';
import {ReadOnlyOverlay} from '../ReadOnlyOverlay.jsx';
import {VisibilitySettings} from '../VisibilitySettings.jsx';

// Hardcoded UUID for preview testing
const TEST_MEMBER_UUID = '40a42d50-32b7-46c9-9875-ad6ceb27dba6';

export function TransistorCard({
    accentColor = '',
    backgroundColor = '',
    isEditing = false,
    visibilityOptions = {},
    handleAccentColorChange = () => {},
    handleBackgroundColorChange = () => {},
    toggleVisibility = () => {},
    showVisibilitySettings = false
}) {
    const [accentColorPickerExpanded, setAccentColorPickerExpanded] = useState(false);
    const [backgroundColorPickerExpanded, setBackgroundColorPickerExpanded] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const tabs = [
        {id: 'design', label: 'Design'},
        {id: 'visibility', label: 'Visibility'}
    ];

    const designSettings = (
        <>
            <ColorPickerSetting
                dataTestId='transistor-accent-color'
                eyedropper={true}
                isExpanded={accentColorPickerExpanded}
                label='Player color'
                swatches={[
                    {title: 'Purple', hex: '#8B5CF6'},
                    {title: 'Blue', hex: '#3B82F6'},
                    {title: 'Green', hex: '#10B981'},
                    {title: 'Black', hex: '#000000'}
                ]}
                value={accentColor || '#8B5CF6'}
                onPickerChange={color => handleAccentColorChange(color)}
                onSwatchChange={(color) => {
                    handleAccentColorChange(color);
                    setAccentColorPickerExpanded(false);
                }}
                onTogglePicker={(isExpanded) => {
                    setAccentColorPickerExpanded(isExpanded);
                    if (isExpanded) {
                        setBackgroundColorPickerExpanded(false);
                    }
                }}
            />
            <ColorPickerSetting
                dataTestId='transistor-background-color'
                eyedropper={true}
                hasTransparentOption={true}
                isExpanded={backgroundColorPickerExpanded}
                label='Background'
                swatches={[
                    {title: 'White', hex: '#FFFFFF'},
                    {title: 'Light grey', hex: '#F3F4F6'},
                    {title: 'Dark', hex: '#1F2937'},
                    {title: 'Black', hex: '#000000'}
                ]}
                value={backgroundColor || '#FFFFFF'}
                onPickerChange={color => handleBackgroundColorChange(color)}
                onSwatchChange={(color) => {
                    handleBackgroundColorChange(color);
                    setBackgroundColorPickerExpanded(false);
                }}
                onTogglePicker={(isExpanded) => {
                    setBackgroundColorPickerExpanded(isExpanded);
                    if (isExpanded) {
                        setAccentColorPickerExpanded(false);
                    }
                }}
            />
        </>
    );

    const visibilitySettings = (
        <VisibilitySettings
            toggleVisibility={toggleVisibility}
            visibilityOptions={visibilityOptions}
        />
    );

    return (
        <>
            <div className="relative w-full rounded-lg border border-grey-300 bg-grey-100 dark:border-grey-900 dark:bg-grey-950">
                {showPreview ? (
                    <TransistorPreview
                        accentColor={accentColor}
                        backgroundColor={backgroundColor}
                    />
                ) : (
                    <TransistorPlaceholder
                        accentColor={accentColor}
                        backgroundColor={backgroundColor}
                    />
                )}
                {/* Preview toggle button */}
                <button
                    className="absolute right-2 top-2 rounded bg-black/50 px-2 py-1 text-xs font-medium text-white hover:bg-black/70"
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                >
                    {showPreview ? 'Hide Preview' : 'Preview'}
                </button>
                {!isEditing && <ReadOnlyOverlay />}
            </div>

            {isEditing && (
                <SettingsPanel
                    defaultTab={showVisibilitySettings ? 'visibility' : 'design'}
                    tabs={tabs}
                    onMouseDown={e => e.preventDefault()}
                >
                    {{
                        design: designSettings,
                        visibility: visibilitySettings
                    }}
                </SettingsPanel>
            )}
        </>
    );
}

function TransistorPreview({accentColor, backgroundColor}) {
    // Build the embed URL with color parameters for live preview
    let embedUrl = `https://partner.transistor.fm/ghost/embed/${TEST_MEMBER_UUID}`;
    const params = [];

    if (accentColor) {
        params.push(`color=${accentColor.replace('#', '')}`);
    }
    if (backgroundColor) {
        params.push(`background=${backgroundColor.replace('#', '')}`);
    }

    if (params.length > 0) {
        embedUrl += '?' + params.join('&');
    }

    return (
        <div className="min-h-[180px]" data-testid="transistor-preview">
            <iframe
                height="180"
                src={embedUrl}
                style={{border: 'none'}}
                title="Transistor Podcast Player Preview"
                width="100%"
            />
        </div>
    );
}

function TransistorPlaceholder({accentColor, backgroundColor}) {
    const previewStyle = {
        backgroundColor: backgroundColor || '#FFFFFF',
        borderColor: accentColor || '#8B5CF6'
    };

    const iconStyle = {
        color: accentColor || '#8B5CF6'
    };

    return (
        <div
            className="flex min-h-[180px] items-center justify-center rounded-lg p-8 transition-colors"
            data-testid="transistor-placeholder"
            style={previewStyle}
        >
            <div className="text-center">
                <div className="mb-3 flex justify-center">
                    <TransistorIcon className="size-12" style={iconStyle} />
                </div>
                <div className="mb-2 text-lg font-semibold" style={{color: accentColor || '#8B5CF6'}}>
                    Transistor Private Podcast
                </div>
                <div className="text-sm text-grey-700 dark:text-grey-400">
                    Personalized player for each member
                </div>
            </div>
        </div>
    );
}

TransistorCard.propTypes = {
    accentColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    isEditing: PropTypes.bool,
    visibilityOptions: PropTypes.array,
    handleAccentColorChange: PropTypes.func,
    handleBackgroundColorChange: PropTypes.func,
    toggleVisibility: PropTypes.func,
    showVisibilitySettings: PropTypes.bool
};

TransistorPreview.propTypes = {
    accentColor: PropTypes.string,
    backgroundColor: PropTypes.string
};

TransistorPlaceholder.propTypes = {
    accentColor: PropTypes.string,
    backgroundColor: PropTypes.string
};
