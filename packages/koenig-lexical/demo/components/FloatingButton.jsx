import React from 'react';

const FloatingButton = ({isOpen, ...props}) => {
    return (
        <div className={`fixed bottom-4 right-6 z-20 rounded py-1 pl-2 font-mono text-sm tracking-tight text-grey-600 transition-all duration-200 ease-in-out xl:p-0 ${isOpen ? 'bg-transparent' : 'bg-white xl:bg-transparent'}`}>
            <button type="button" className="cursor-pointer" onClick={() => props.onClick('json')}>
                JSON output
            </button>
            &nbsp;|&nbsp;
            <button type="button" className="cursor-pointer" onClick={() => props.onClick('tree')}>
                State tree
            </button>
        </div>
    );
};

export default FloatingButton;
