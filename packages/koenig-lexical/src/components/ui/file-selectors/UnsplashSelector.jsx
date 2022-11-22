import React from 'react';
import {ReactComponent as UnsplashIcon} from '../../../assets/icons/kg-card-type-unsplash.svg';
import {ReactComponent as SearchIcon} from '../../../assets/icons/kg-search.svg';
import {ReactComponent as CloseIcon} from '../../../assets/icons/kg-close.svg';

export function UnsplashSelector() {
    return (
        <>
            <div className="bg-black opacity-60 inset-0 h-[100vh]"></div>
            <div className="bg-white inset-8 rounded z-40 overflow-hidden absolute shadow-xl">
                <button className="absolute top-6 right-6">
                    <CloseIcon className="w-4 h-4 text-grey-400 stroke-2" />
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
                        <div className="overflow-auto w-full h-full px-20 flex justify-center">
                            <div className="flex  flex-col justify-start mr-6 grow basis-0 last-of-type:mr-0">
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1574948495680-f67aab1ec3ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDMyMXx8c3VtbWVyfGVufDB8fHx8MTY2OTEwNDUwNw&ixlib=rb-4.0.3&q=80&w=1200" />
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1595905710073-c5bf3611d945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDIzfHxzZWElMjBncmVlbnxlbnwwfHx8fDE2NjkxMDU3MTA&ixlib=rb-4.0.3&q=80&w=1200" />
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1526676537331-7747bf8278fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDEyfHxhdGhsZXRpY3MlMjB0cmFja3xlbnwwfHx8fDE2NjkxMDU1MTA&ixlib=rb-4.0.3&q=80&w=1200" />
                            </div>
                            <div className="flex  flex-col justify-start mr-6 grow basis-0 last-of-type:mr-0">
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE0MHx8cnVubmluZ3xlbnwwfHx8fDE2NjkxMDM3MTE&ixlib=rb-4.0.3&q=80&w=1200" />
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1668584054035-f5ba7d426401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8YWxsfDI3Mnx8fHx8fDJ8fDE2NjkxMDUxNTA&ixlib=rb-4.0.3&q=80&w=1200" />
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1668656690938-bbb5ec240ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8YWxsfDMwNHx8fHx8fDJ8fDE2NjkxMDUyMTQ&ixlib=rb-4.0.3&q=80&w=1200" />
                            </div>
                            <div className="flex  flex-col justify-start mr-6 grow basis-0 last-of-type:mr-0">
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1668952410266-e86775275752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8YWxsfDExN3x8fHx8fDJ8fDE2NjkxMDQ2Nzk&ixlib=rb-4.0.3&q=80&w=1200" />
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1597305877032-0668b3c6413a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDR8fHBsYW50fGVufDB8fHx8MTY2OTEwNjIwOA&ixlib=rb-4.0.3&q=80&w=1200" />
                                <UnsplashImg imgUrl="https://images.unsplash.com/photo-1591087068118-0e6b440716c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE4OXx8b3JhbmdlfGVufDB8fHx8MTY2OTEwNTM4NQ&ixlib=rb-4.0.3&q=80&w=1200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function UnsplashImg({imgUrl}) {
    return (
        <div className="relative block w-full mb-6 cursor-zoom-in bg-grey-100">
            <img src={imgUrl} alt="Unsplash" />
        </div>
    );
}