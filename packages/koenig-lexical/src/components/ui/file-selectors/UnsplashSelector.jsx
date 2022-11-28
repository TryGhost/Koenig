import React from 'react';
import PropTypes from 'prop-types';
import {ReactComponent as UnsplashIcon} from '../../../assets/icons/kg-card-type-unsplash.svg';
import {ReactComponent as SearchIcon} from '../../../assets/icons/kg-search.svg';
import {ReactComponent as CloseIcon} from '../../../assets/icons/kg-close.svg';
import {ReactComponent as UnsplashHeartIcon} from '../../../assets/icons/kg-unsplash-heart.svg';
import {ReactComponent as DownloadIcon} from '../../../assets/icons/kg-download.svg';

const demoDataset = [
    {
        id: 1,
        imgUrl: 'https://images.unsplash.com/photo-1574948495680-f67aab1ec3ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDMyMXx8c3VtbWVyfGVufDB8fHx8MTY2OTEwNDUwNw&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 1'
    },
    {
        id: 2,
        imgUrl: 'https://images.unsplash.com/photo-1595905710073-c5bf3611d945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDIzfHxzZWElMjBncmVlbnxlbnwwfHx8fDE2NjkxMDU3MTA&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 2'
    },
    {
        id: 3,
        imgUrl: 'https://images.unsplash.com/photo-1526676537331-7747bf8278fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDEyfHxhdGhsZXRpY3MlMjB0cmFja3xlbnwwfHx8fDE2NjkxMDU1MTA&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 3'
    },
    {
        id: 4,
        imgUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE0MHx8cnVubmluZ3xlbnwwfHx8fDE2NjkxMDM3MTE&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 4'
    },
    {
        id: 5,
        imgUrl: 'https://images.unsplash.com/photo-1668584054035-f5ba7d426401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8YWxsfDI3Mnx8fHx8fDJ8fDE2NjkxMDUxNTA&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 5'
    },
    {
        id: 6,
        imgUrl: 'https://images.unsplash.com/photo-1668656690938-bbb5ec240ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8YWxsfDMwNHx8fHx8fDJ8fDE2NjkxMDUyMTQ&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 6'
    },
    {
        id: 7,
        imgUrl: 'https://images.unsplash.com/photo-1668952410266-e86775275752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8YWxsfDExN3x8fHx8fDJ8fDE2NjkxMDQ2Nzk&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 7'
    },
    {
        id: 8,
        imgUrl: 'https://images.unsplash.com/photo-1597305877032-0668b3c6413a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDR8fHBsYW50fGVufDB8fHx8MTY2OTEwNjIwOA&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 8'
    },
    {
        id: 9,
        imgUrl: 'https://images.unsplash.com/photo-1591087068118-0e6b440716c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE4OXx8b3JhbmdlfGVufDB8fHx8MTY2OTEwNTM4NQ&ixlib=rb-4.0.3&q=80&w=1200',
        caption: 'Caption 9'
    },
    {
        id: 10,
        imgUrl: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3570&q=80',
        caption: 'Caption 10'
    }
];

// todo replace with better algo
const divideArray = (arr, n) => {
    const len = arr.length;
    const out = [];
    let i = 0;
    while (i < len) {
        // eslint-disable-next-line no-plusplus
        const size = Math.ceil((len - i) / n--);
        out.push(arr.slice(i, i += size));
    }
    return out;
};

export function UnsplashSelector({toggle, insertImage, zoomedUrl, closeModal}) {
    const [zoomedImg, setZoomedImg] = React.useState(zoomedUrl || null);
    const selectImg = (imgUrl) => {
        setZoomedImg(imgUrl);
    };
    return (
        <>
            <div className="bg-black opacity-60 inset-0 h-[100vh] absolute"></div>
            <div data-kg-modal="unsplash" className="bg-white inset-8 rounded z-40 overflow-hidden absolute shadow-xl">
                <button className="absolute top-6 right-6 cursor-pointer">
                    <CloseIcon 
                        data-kg-modal-close-button 
                        onClick={() => closeModal()} 
                        className="w-4 h-4 text-grey-400 stroke-2" 
                    />
                </button>
                <div className="flex flex-col h-full">
                    <header className="flex shrink-0 justify-between py-10 px-20 items-center">
                        <h1 className="flex items-center gap-2 text-black text-3xl font-bold font-sans">
                            <UnsplashIcon className="mb-1" />
                            Unsplash
                        </h1>
                        <div className="relative w-full max-w-sm">
                            <SearchIcon className="absolute top-1/2 left-4 w-4 h-4 -translate-y-2 text-grey-700" />
                            <input className="pr-8 pl-10 border border-grey-300 rounded-full font-sans text-md font-normal text-black h-10 w-full focus:border-grey-400 focus-visible:outline-none" placeholder="Search free high-resolution photos" />
                        </div>
                    </header>
                    <div className="relative h-full overflow-hidden">
                        <div className={`overflow-auto w-full h-full px-20 flex justify-center ${zoomedImg ? 'pb-10' : ''}`}>
                            {zoomedImg ?
                                <UnsplashZoomed imgUrl={zoomedImg} setZoomedImg={setZoomedImg} selectImg={selectImg} insertImage={insertImage} />
                                :
                                <UnsplashGallery selectImg={selectImg} insertImage={insertImage} dataset={demoDataset} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function UnsplashGallery({insertImage, selectImg, dataset}) {
    const newArray = divideArray(dataset, 3);
    return newArray.map((array, index) => (
        <div data-kg-unsplash-gallery key={index} className="flex flex-col justify-start mr-6 grow basis-0 last-of-type:mr-0">
            {array.map(item => (
                <UnsplashImg key={item.id} imgUrl={item.imgUrl} caption={item.caption} selectImg={selectImg} insertImage={insertImage} />
            ))}
        </div>
    ));
}

function UnsplashZoomed({imgUrl, setZoomedImg, insertImage, selectImg}) {
    return (
        <div data-kg-unsplash-zoomed onClick={() => setZoomedImg(null)} className="flex justify-center grow basis-0 h-full">
            <UnsplashImg zoomed="true" imgUrl={imgUrl} insertImage={insertImage} selectImg={selectImg} />
        </div>
    );
}

function UnsplashImg({imgUrl, zoomed, insertImage, selectImg}) {
    return (
        <div data-kg-unsplash-gallery-item onClick={() => selectImg(imgUrl)} className={`relative block mb-6 bg-grey-100 ${zoomed ? 'cursor-zoom-out w-[max-content] h-full' : 'cursor-zoom-in w-full'}`}>
            <img src={imgUrl} alt="Unsplash" className={`${zoomed ? 'object-contain w-auto h-full' : ''}`} />
            <div className="absolute inset-0 flex flex-col justify-between p-5 transition-all ease-in-out bg-gradient-to-b from-black/5 via-black/5 to-black/30 opacity-0 hover:opacity-100">
                <div className="flex items-center justify-end">
                    <UnsplashButton icon="heart" label="127" />
                    <UnsplashButton icon="download" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img className="w-8 h-8 rounded-full mr-2" src="https://images.unsplash.com/profile-1562493255799-d28c159b565e?auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff" alt="author" />
                        <div className="mr-2 font-sans text-white text-sm font-medium truncate">Richard de Ruijter</div>
                    </div>
                    <UnsplashButton data-kg-unsplash-insert-button onClick={() => {
                        insertImage({
                            src: imgUrl
                        });
                    }} label="Insert image" />
                </div>
            </div>
        </div>
    );
}

const BUTTON_ICONS = {
    heart: UnsplashHeartIcon,
    download: DownloadIcon
};

function UnsplashButton({icon, label, ...props}) {
    const Icon = BUTTON_ICONS[icon];

    return (
        <button 
            type="button" 
            className="flex items-center shrink-0 h-8 py-2 px-3 font-sans text-sm text-grey-700 font-medium leading-6 bg-white rounded-md opacity-90 transition-all ease-in-out hover:opacity-100 first-of-type:mr-3 cursor-pointer" 
            {...props}
        >
            {icon && <Icon className={`w-4 h-4 fill-red stroke-[3px] ${label && 'mr-1'}`} />}
            {label && <span>{label}</span>}
        </button>
    );
}

UnsplashSelector.propTypes = {
    selectImg: PropTypes.func,
    insertImage: PropTypes.func,
    zoomedUrl: PropTypes.string
};

UnsplashZoomed.propTypes = {
    imgUrl: PropTypes.string
};
