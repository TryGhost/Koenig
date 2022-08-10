import React from 'react';

const Editor = ({isEditing, payload, Alt, editor, env}) => {
    const handleTextChange = (e) => {
        payload.setPayload({...payload.payload, alt: e.target.value});
        env.save({alt: e.target.value, src: payload.payload.src});
    };

    return (
        <figcaption>
            <div className="wrapper">
                <div className="cursor-text text-sm caret-inherit" >
                    {
                        Alt ? 
                            <input
                                className="w-100"
                                type='text'
                                value={payload.payload.alt}
                                onChange={handleTextChange}
                            />
                            :
                            <p>should be mobiledoc editor here</p>
                    }
                </div>
            </div>
        </figcaption>
    );
};

const Image = (props) => {
    const [payload, setPayload] = React.useState({
        src: props?.payload?.src || 'https://images.unsplash.com/photo-1524612219806-a2423c90e45e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        alt: props?.payload?.alt || '',
        caption: props?.payload?.caption || 'image caption'
    });
    const [isEditing, setIsEditing] = React.useState(true);
    const [editAlt, setEditAlt] = React.useState(true);

    return (
        <div>
            <div className="__mobiledoc-card">
                <div className='relative'><img src={payload?.src || ``} alt={payload?.alt || 'image alt description'} /></div>
                <div className='hidden'>upload field comes here</div>
                <Editor Alt={editAlt} isEditing={isEditing} payload={{payload, setPayload}} env={props.env} />
                <button onClick={() => setEditAlt(!editAlt)} className={` absolute bottom-0 right-0 cursor-pointer rounded-lg text-sm shadow-[0_0_0_1px] ${editAlt ? 'bg-green-500' : 'shadow-gray-500'} `}>Alt</button>
            </div>
        </div>
    );
};

export default Image;
