import React from 'react';
import PropTypes from 'prop-types';
import {ReactComponent as UnsplashIcon} from '../../../assets/icons/kg-card-type-unsplash.svg';
import {ReactComponent as SearchIcon} from '../../../assets/icons/kg-search.svg';
import {ReactComponent as CloseIcon} from '../../../assets/icons/kg-close.svg';
import {ReactComponent as UnsplashHeartIcon} from '../../../assets/icons/kg-unsplash-heart.svg';
import {ReactComponent as DownloadIcon} from '../../../assets/icons/kg-download.svg';

export function UnsplashSelector({insertImage, closeModal, UnsplashLib, Masonry}) {
    const galleryRef = React.useRef();
    const initLoadRef = React.useRef(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [zoomedImg, setZoomedImg] = React.useState(null);
    const [dataset, setDataset] = React.useState([]);
    const selectImg = (payload) => {
        setZoomedImg(payload);
    };

    const loadData = React.useCallback(async () => {
        if (initLoadRef.current === false) {
            await UnsplashLib.loadNew();
            const photos = UnsplashLib.getPhotos();
            Masonry.addPhotos(photos);
            const newArray = Masonry.getColumns();
            setDataset(newArray);
            setIsLoading(false);
        }
    }, [UnsplashLib, Masonry]);

    // TODO add infinite scroll

    React.useEffect(() => {
        loadData();
        return () => {
            initLoadRef.current = true;
        };
    }, [loadData]);

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
                        <div ref={galleryRef} className={`overflow-auto w-full h-full px-20 flex justify-center ${zoomedImg ? 'pb-10' : ''}`}>
                            {zoomedImg ?
                                <UnsplashZoomed payload={zoomedImg} setZoomedImg={setZoomedImg} selectImg={selectImg} insertImage={insertImage} />
                                :
                                isLoading ?
                                    <p>Loading...</p>
                                    :
                                    <UnsplashGallery selectImg={selectImg} insertImage={insertImage} dataset={dataset} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function UnsplashGallery({insertImage, selectImg, dataset}) {
    return dataset.map((array, index) => (
        <div data-kg-unsplash-gallery key={index} className="flex flex-col justify-start mr-6 grow basis-0 last-of-type:mr-0">
            {array.map(item => (
                <UnsplashImg key={item.id} payload={item} caption={`Photo by ${item.user.name} on Unsplash`} selectImg={selectImg} insertImage={insertImage} />
            ))}
        </div>
    ));
}

function UnsplashImg({payload, zoomed, insertImage, selectImg}) {
    return (
        <div data-kg-unsplash-gallery-item onClick={() => selectImg(payload)} className={`relative block mb-6 bg-grey-100 ${zoomed ? 'cursor-zoom-out w-[max-content] h-full' : 'cursor-zoom-in w-full'}`}>
            <img src={payload.urls.regular} alt="Unsplash" className={`${zoomed ? 'object-contain w-auto h-full' : ''}`} />
            <div className="absolute inset-0 flex flex-col justify-between p-5 transition-all ease-in-out bg-gradient-to-b from-black/5 via-black/5 to-black/30 opacity-0 hover:opacity-100">
                <div className="flex items-center justify-end">
                    <UnsplashButton icon="heart" label="127" />
                    <UnsplashButton icon="download" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img className="w-8 h-8 rounded-full mr-2" src={payload.user.profile_image.small} alt="author" />
                        <div className="mr-2 font-sans text-white text-sm font-medium truncate">{payload.user.name}</div>
                    </div>
                    <UnsplashButton data-kg-unsplash-insert-button onClick={() => {
                        insertImage({
                            src: payload.urls.full,
                            caption: `Photo by ${payload.user.name} on Unsplash`,
                            height: payload.height,
                            width: payload.width,
                            alt: payload.alt_description
                        });
                    }} label="Insert image" />
                </div>
            </div>
        </div>
    );
}

function UnsplashZoomed({payload, setZoomedImg, insertImage, selectImg}) {
    return (
        <div data-kg-unsplash-zoomed onClick={() => setZoomedImg(null)} className="flex justify-center grow basis-0 h-full">
            <UnsplashImg zoomed="true" payload={payload} insertImage={insertImage} selectImg={selectImg} />
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
