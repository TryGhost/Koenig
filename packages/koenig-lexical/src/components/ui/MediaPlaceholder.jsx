const CardText = ({text}) => {
    return (
        <span className="text-sm font-bold">{text}</span>
    );
};

export function MediaPlaceholder({desc, Icon, filePicker, size, handleDrag, handleDrop, hasDragOver, ...props}) {
    return (
        <div
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag} 
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="border border-transparent" {...props}>
            <div className={`h-100 relative flex items-center justify-center border border-grey/20 bg-grey-50 ${size === 'small' ? 'before:pb-[12.5%]' : 'before:pb-[62.5%]'}`}>
                {
                    hasDragOver ?
                        <CardText text="Drop it like it's hot 🔥" />
                        :
                        <>
                            <button onClick={filePicker} name="placeholder-button" className={`group flex cursor-pointer items-center justify-center ${size === 'small' ? 'p-4' : 'p-20 flex-col'}`}>
                                <Icon className={`opacity-80 transition-all ease-linear group-hover:scale-105 group-hover:opacity-100 ${size === 'large' ? 'h-20 w-20 text-grey' : size === 'small' ? 'w-6 h-6 mr-3 text-grey-700' : 'h-16 w-16 text-grey'}`} />
                                <p className={`font-sans text-sm font-normal text-grey-700 transition-all group-hover:text-grey-800 ${size === 'small' ? '' : 'mt-4'}`}>{desc}</p>
                            </button>
                        </>
                }
            </div>
        </div>
    );
}
