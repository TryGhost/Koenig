// import KoenigHeaderEditor from '../../KoenigHeaderEditor';
// import ImageUploadForm from '../ImageUploadForm';
import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '../Button';
import {ButtonGroupSetting, ColorPickerSetting, InputSetting, SettingsDivider, SettingsPanel, ToggleSetting} from '../SettingsPanel';
import {ReactComponent as FileUploadIcon} from '../../../assets/icons/kg-upload-fill.svg';
// import {MediaPlaceholder} from '../MediaPlaceholder';
import {ReactComponent as PlusIcon} from '../../../assets/icons/plus.svg';
import {ReactComponent as TrashIcon} from '../../../assets/icons/kg-trash.svg';
import {sanitizeHtml} from '../../../utils/sanitize-html';
export const HEADER_COLORS = {
    dark: 'bg-black',
    light: 'bg-grey-100',
    accent: 'bg-pink'
};

function ImagePicker({onFileChange, backgroundImageSrc, handleClearBackgroundImage}) {
    const [backgroundImagePreview, setBackgroundImagePreview] = React.useState(false);

    const fileInputRef = React.useRef(null);

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const toggleBackgroundImagePreview = () => {
        setBackgroundImagePreview(!backgroundImagePreview);
    };
    
    React.useEffect(() => {
        if (backgroundImageSrc !== null) {
            setBackgroundImagePreview(true);
        }
    }, [backgroundImageSrc]);

    return (
        <>
        
            <button ref={fileInputRef} className='flex h-[3rem] w-[3rem] cursor-pointer items-center justify-center rounded-full border-2 border-transparent' type="button" onClick={toggleBackgroundImagePreview}>
                <span className="border-1 flex h-6 w-6 items-center justify-center rounded-full border border-black/5">
                    <PlusIcon className="h-3 w-3 stroke-grey-700 stroke-2 dark:stroke-grey-500 dark:group-hover:stroke-grey-100" />
                </span>
            </button>
            <form onChange={onFileChange}>
                <input
                    ref={fileInputRef}
                    accept='image/*'
                    hidden={true}
                    name="image-input"
                    type='file'
                />
            </form>
            {
                backgroundImagePreview && (
                    <div className="w-full">
                        <div className="relative">
                            <div className=" flex w-full items-center justify-center rounded-sm border border-dashed border-grey-300 bg-grey-50">
                                {
                                    backgroundImageSrc ? 
                                        <>
                                            <div className="absolute inset-0 p-2">
                                                <div className="flex flex-row-reverse">
                                                    <button className="pointer-events-auto rounded-sm bg-white/90 py-1 px-2" type="button" onClick={handleClearBackgroundImage}>
                                                        <TrashIcon className="h-5 w-5 fill-grey-900 stroke-[3px] transition-all ease-linear group-hover:scale-105" />
                                                    </button>
                                                </div>
                                            </div>
                                            <img alt='backgroundHeaderImage' src={backgroundImageSrc} />
                                            
                                        </>
                                        :                                          
                                        <button className="group flex h-[120px] cursor-pointer flex-col items-center justify-center" type="button" onClick={openFilePicker}>
                                            <FileUploadIcon className="h-5 w-5 fill-grey-700 stroke-[3px] transition-all ease-linear group-hover:scale-105" />
                                            <span className="px-1 text-[1.35rem] font-medium text-grey-700">Click to upload background image</span>
                                        </button>
                                        
                                }
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    );
}

export function HeaderCard({isEditing, 
    size, 
    backgroundColor, 
    heading, 
    headingPlaceholder, 
    subHeading, 
    subHeadingPlaceholder, 
    button, 
    buttonText, 
    buttonPlaceholder, 
    buttonUrl, 
    // handleHeadingTextEdit, 
    // handleSubheadingTextEdit, 
    // nodeKey, 
    handleColorSelector,
    handleSizeSelector,
    handleButtonText,
    handleButtonUrl,
    backgroundImageSrc,
    onFileChange,
    handleClearBackgroundImage,
    handleButtonToggle}) {
    const buttonGroupChildren = [
        {
            label: 'S',
            name: 'small'
        },
        {
            label: 'M',
            name: 'medium'
        },
        {
            label: 'L',
            name: 'large'
        }
    ];

    const colorPickerChildren = [
        {
            label: 'Dark',
            name: 'dark',
            color: 'black'
        },
        {
            label: 'Light',
            name: 'light',
            color: 'grey-50'
        },
        {
            label: 'Accent',
            name: 'accent',
            color: 'pink'
        }
    ];

    return (
        <>
            <div className={`not-kg-prose flex flex-col items-center justify-center text-center font-sans ${(size === 'small') ? 'min-h-[40vh] py-[14vmin]' : (size === 'medium') ? 'min-h-[60vh] py-[12vmin]' : 'min-h-[80vh] py-[18vmin]'} ${HEADER_COLORS[backgroundColor]} `} 
                style={backgroundImageSrc ? {
                    backgroundImage: `url(${backgroundImageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center'
                } : null}>

                <div dangerouslySetInnerHTML={{__html: heading !== '' ? sanitizeHtml(heading) : headingPlaceholder}} className={`whitespace-normal font-extrabold leading-tight ${(size === 'small') ? 'text-6xl' : (size === 'medium') ? 'text-7xl' : 'text-8xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'} {heading || ''}`}/>
                <div dangerouslySetInnerHTML={{__html: heading ? sanitizeHtml(subHeading) : subHeadingPlaceholder}} className={`w-full whitespace-normal font-normal ${(size === 'small') ? 'mt-2 text-2xl' : (size === 'medium') ? 'mt-3 text-[2.7rem]' : 'mt-3 text-3xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'}`}/>

                {/* {
                    isEditing ?
                        <KoenigHeaderEditor
                            className={`whitespace-normal font-extrabold leading-tight ${(size === 'small') ? 'text-6xl' : (size === 'medium') ? 'text-7xl' : 'text-8xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'}`}
                            headingPlaceholder={headingPlaceholder}
                            html={heading}
                            nodeKey={nodeKey}
                            readOnly={isEditing}
                            setHtml={handleHeadingTextEdit}
                            size={size}
                        />
                        :
                        <div dangerouslySetInnerHTML={{__html: heading !== '' ? sanitizeHtml(heading) : headingPlaceholder}} className={`whitespace-normal font-extrabold leading-tight ${(size === 'small') ? 'text-6xl' : (size === 'medium') ? 'text-7xl' : 'text-8xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'} {heading || ''}`}/>
                } */}

                {/* {
                    isEditing ?
                        <KoenigHeaderEditor
                            className={`w-full whitespace-normal font-normal ${(size === 'small') ? 'mt-2 text-2xl' : (size === 'medium') ? 'mt-3 text-[2.7rem]' : 'mt-3 text-3xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'}`}
                            headingPlaceholder={subHeadingPlaceholder}
                            html={subHeading}
                            nodeKey={nodeKey}
                            readOnly={isEditing}
                            setHtml={handleSubheadingTextEdit}
                            size={size}
                        />
                        :
                        <div dangerouslySetInnerHTML={{__html: heading ? sanitizeHtml(subHeading) : subHeadingPlaceholder}} className={`w-full whitespace-normal font-normal ${(size === 'small') ? 'mt-2 text-2xl' : (size === 'medium') ? 'mt-3 text-[2.7rem]' : 'mt-3 text-3xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'}`}/>
                } */}

                { (button && (isEditing || (buttonText && buttonUrl))) && 
                <div className={`${(size === 'S') ? 'mt-6' : (size === 'M') ? 'mt-8' : 'mt-10'}`}>
                    {((button && (backgroundColor === 'light')) && <Button placeholder={buttonPlaceholder} size={size} value={buttonText} />) || (button && <Button color='light' placeholder={buttonPlaceholder} size={size} value={buttonText} />)}
                </div>
                }
            </div>

            {isEditing && (
                <SettingsPanel>
                    <ButtonGroupSetting
                        buttons={buttonGroupChildren}
                        label='Size'
                        selectedName={size}
                        onClick={handleSizeSelector}
                    />
                    <ColorPickerSetting
                        buttons={colorPickerChildren}
                        label='Style'
                        selectedName={backgroundColor}
                        onClick={handleColorSelector}
                    />
                    <ImagePicker
                        backgroundImageSrc={backgroundImageSrc}
                        handleClearBackgroundImage={handleClearBackgroundImage}
                        onFileChange={onFileChange}
                    />
                    <SettingsDivider />
                    <ToggleSetting
                        isChecked={button}
                        label='Button'
                        onChange={handleButtonToggle}
                    />
                    {button && (
                        <>
                            <InputSetting
                                label='Button text'
                                placeholder='Add button text'
                                value={buttonText}
                                onChange={handleButtonText}

                            />
                            <InputSetting
                                label='Button URL'
                                placeholder='https://yoursite.com/#/portal/signup/'
                                value={buttonUrl}
                                onChange={handleButtonUrl}
                            />
                        </>
                    )}
                </SettingsPanel>    
            )}
        </>
    );
}

HeaderCard.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    backgroundColor: PropTypes.oneOf(['dark', 'light', 'accent']),
    heading: PropTypes.string,
    headingPlaceholder: PropTypes.string,
    subHeading: PropTypes.string,
    subHeadingPlaceholder: PropTypes.string,
    button: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonPlaceholder: PropTypes.string
};