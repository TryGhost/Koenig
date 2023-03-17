import EmojiPicker from 'emoji-picker-react';
import Portal from './Portal';

const EmojiPickerPortal = ({onEmojiClick}) => {
    return (
        <Portal>
            
            <div className='fixed inset-0 z-50 flex items-center justify-center'>
                <div className='overflow-y-scroll rounded bg-white p-4 shadow-lg'>
                    <EmojiPicker 
                        onEmojiClick={onEmojiClick} 
                    />
                </div>
            </div>
        </Portal>
    );
};

export default EmojiPickerPortal;
