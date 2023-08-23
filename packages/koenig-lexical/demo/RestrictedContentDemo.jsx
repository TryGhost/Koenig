import FloatingButton from './components/FloatingButton';
import React from 'react';
import Sidebar from './components/Sidebar';
import Watermark from './components/Watermark';
import {$getRoot, $isDecoratorNode} from 'lexical';
import {KoenigComposableEditor, KoenigComposer, RestrictContentPlugin} from '../src';
import {defaultHeaders as defaultUnsplashHeaders} from './utils/unsplashConfig';
import {fileTypes, useFileUpload} from './utils/useFileUpload';
import {tenorConfig} from './utils/tenorConfig';
import {useLocation} from 'react-router-dom';
import {useSnippets} from './utils/useSnippets';
import {useState} from 'react';

const cardConfig = {
    unsplash: {defaultHeaders: defaultUnsplashHeaders},
    tenor: tenorConfig
};

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function RestrictedContentDemo() {
    let query = useQuery();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarView, setSidebarView] = useState('json');
    const [defaultContent] = useState(undefined);
    const [editorAPI, setEditorAPI] = useState(null);
    const titleRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const paragraphs = query.get('paragraphs') || 1;
    const {snippets, createSnippet, deleteSnippet} = useSnippets();

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

    function focusEditor(event) {
        const clickedOnDecorator = (event.target.closest('[data-lexical-decorator]') !== null) || event.target.hasAttribute('data-lexical-decorator');
        const clickedOnSlashMenu = (event.target.closest('[data-kg-slash-menu]') !== null) || event.target.hasAttribute('data-kg-slash-menu');

        if (editorAPI && !clickedOnDecorator && !clickedOnSlashMenu) {
            let editor = editorAPI.editorInstance;
            let {bottom} = editor._rootElement.getBoundingClientRect();

            // if a mousedown and subsequent mouseup occurs below the editor
            // canvas, focus the editor and put the cursor at the end of the document
            if (event.pageY > bottom && event.clientY > bottom) {
                event.preventDefault();

                // we should always have a visible cursor when focusing
                // at the bottom so create an empty paragraph if last
                // section is a card
                let addLastParagraph = false;

                editor.getEditorState().read(() => {
                    const lastNode = $getRoot().getChildren().at(-1);

                    if ($isDecoratorNode(lastNode)) {
                        addLastParagraph = true;
                    }
                });

                if (addLastParagraph) {
                    editorAPI.insertParagraphAtBottom();
                }

                // Focus the editor
                editorAPI.focusEditor({position: 'bottom'});

                //scroll to the bottom of the container
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }
    }

    return (
        <div
            className="koenig-lexical top"
        >
            <KoenigComposer
                cardConfig={{...cardConfig, snippets, createSnippet, deleteSnippet}}
                fileUploader={{useFileUpload, fileTypes}}
                initialEditorState={defaultContent}
            >
                <div className="relative h-full grow">
                    <div ref={containerRef} className="h-full overflow-auto" onClick={focusEditor}>
                        <div className="mx-auto max-w-[740px] px-6 py-[15vmin] lg:px-0">
                            <KoenigComposableEditor
                                cursorDidExitAtTop={focusTitle}
                                registerAPI={setEditorAPI}
                            >
                                <RestrictContentPlugin paragraphs={paragraphs} />
                            </KoenigComposableEditor>
                        </div>
                    </div>
                </div>
                <Watermark />
                <div className="absolute z-20 flex h-full flex-col items-end sm:relative">
                    <Sidebar isOpen={isSidebarOpen} view={sidebarView} />
                    <FloatingButton isOpen={isSidebarOpen} onClick={openSidebar} />
                </div>
            </KoenigComposer>
        </div>
    );
}

export default RestrictedContentDemo;
