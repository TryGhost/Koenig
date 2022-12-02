import React from 'react';
import {KoenigComposer, KoenigEditor} from '../src';
import FloatingButton from './components/FloatingButton';
import {useState} from 'react';
import Watermark from './components/Watermark';
import {imageUploader} from './utils/imageUploader';
import Sidebar from './components/Sidebar';
import content from './content/content.json';
import ToggleButton from './components/ToggleButton';
import {useLocation} from 'react-router-dom';
import TitleTextBox from './components/TitleTextBox';
import {defaultHeaders as unsplashConfig} from './utils/unsplashConfig';

const loadContent = () => {
    const cnt = JSON.stringify(content);
    return cnt;
};

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function DemoApp() {
    let query = useQuery();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarView, setSidebarView] = useState('json');
    const [defaultContent] = useState(query.get('content') !== 'false' ? loadContent() : undefined);
    const [title, setTitle] = useState(defaultContent ? 'Meet the Koenig editor.' : '');
    const [editorAPI, setEditorAPI] = useState(null);
    const titleRef = React.useRef(null);

    function openSidebar(view = 'json') {
        if (isSidebarOpen && sidebarView === view) {
            return setIsSidebarOpen(false);
        }
        setSidebarView(view);
        setIsSidebarOpen(true);
    }

    function focusTitle() {
        titleRef.current?.focus();
    }

    return (
        <div className="koenig-lexical top">
            <KoenigComposer 
                initialEditorState={defaultContent} 
                imageUploadFunction={{imageUploader}}
                unsplashConfig={unsplashConfig}>
                <div className="h-full grow relative">
                    {
                        query.get('content') !== 'false'
                            ? <ToggleButton setTitle={setTitle} content={defaultContent}/>
                            : null
                    }
                    <div className="h-full overflow-auto">
                        <div className="mx-auto max-w-[740px] py-[15vmin] px-6 lg:px-0">
                            <TitleTextBox title={title} setTitle={setTitle} editorAPI={editorAPI} ref={titleRef} />
                            <KoenigEditor
                                registerAPI={setEditorAPI}
                                cursorDidExitAtTop={focusTitle}
                            />
                        </div>
                    </div>
                </div>
                <Watermark />
                <div className="absolute sm:relative flex h-full flex-col items-end z-20">
                    <Sidebar isOpen={isSidebarOpen} view={sidebarView} />
                    <FloatingButton isOpen={isSidebarOpen} onClick={openSidebar} />
                </div>
            </KoenigComposer>
        </div>
    );
}

export default DemoApp;
