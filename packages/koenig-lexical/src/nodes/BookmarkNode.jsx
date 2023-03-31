import CardContext from '../context/CardContext';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar.jsx';
import {BookmarkNode as BaseBookmarkNode, INSERT_BOOKMARK_COMMAND} from '@tryghost/kg-default-nodes';
import {BookmarkCard} from '../components/ui/cards/BookmarkCard';
import {ReactComponent as BookmarkCardIcon} from '../assets/icons/kg-card-type-bookmark.svg';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_BOOKMARK_COMMAND} from '@tryghost/kg-default-nodes';

function BookmarkNodeComponent({nodeKey, url, icon, title, description, publisher, thumbnail, caption}) {
    const [editor] = useLexicalComposerContext();

    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);
    const [urlInputValue, setUrlInputValue] = React.useState('');

    const setCaption = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setCaption(value);
        });
    };

    // const handleToolbarEdit = (event) => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     setEditing(true);
    // };

    // const handleUrlChange = (event) => {
    //     editor.update(() => {
    //         const node = $getNodeByKey(nodeKey);
    //         node.setUrl(event.target.value);
    //     });
    // };

    const handleUrlChange = (event) => {
        console.log(`urlInputValue`, event.target.value);
        setUrlInputValue(event.target.value);
    };

    const handleUrlInput = async (event) => {
        // console.log(`fetching... `,event.target.value);
        // let response;
        // try {
        //     response = await (await fetch(event.target.value)).text();
        //     console.log(response);
        // } catch (e) {
        //     console.log(`error`,e);
        // }
        // need to use metascraper to mock this up properly?..
        console.log(`test data`);
        const testData = {
            url: 'https://www.ghost.org/',
            icon: 'https://www.ghost.org/favicon.ico',
            title: 'Ghost: The Creator Economy Platform',
            description: 'doing kewl stuff',
            publisher: 'Ghost - The Professional Publishing Platform',
            thumbnail: 'https://ghost.org/images/meta/ghost.png',
            caption: 'caption here'
        };
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            // console.log(`node`,node);
            node.setUrl(testData.url);
            node.setIcon(testData.icon);
            node.setTitle(testData.title);
            node.setDescription(testData.description);
            node.setPublisher(testData.publisher);
            node.setThumbnail(testData.thumbnail);
        });
    };

    React.useEffect(() => {
        // console.log(`isEditing`,isEditing);
        // console.log(`isSelected`,isSelected);
        // fetchEmbed('test','bookmark');
        // console.log(fetchEmbed('test', {type: 'bookmark'}));
        editor.focus();
        if (!isEditing && isSelected) {
            setEditing(true);
        }
        // only run on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <BookmarkCard
                caption={caption}
                description={description}
                handleUrlChange={handleUrlChange}
                handleUrlInput={handleUrlInput}
                icon={icon}
                isSelected={isSelected}
                publisher={publisher}
                setCaption={setCaption}
                thumbnail={thumbnail}
                title={title}
                url={url}
                urlInputValue={urlInputValue}
                urlPlaceholder={`Paste URL to add bookmark content...`}
            />
            {/* <ActionToolbar
                data-kg-card-toolbar="bookmark"
                isVisible={title && isSelected && !isEditing}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem dataTestId="edit-bookmark-card" icon="edit" isActive={false} label="Edit" onClick={handleToolbarEdit} />
                    <ToolbarMenuSeparator />
                    <ToolbarMenuItem icon="snippet" isActive={false} label="Snippet" />
                </ToolbarMenu>
            </ActionToolbar> */}
        </>
    );
}

export class BookmarkNode extends BaseBookmarkNode {
    static kgMenu = [{
        label: 'Bookmark',
        desc: 'Embed a link as a visual bookmark',
        Icon: BookmarkCardIcon,
        insertCommand: INSERT_BOOKMARK_COMMAND,
        matches: ['bookmark']
    }];

    getIcon() {
        return BookmarkCardIcon;
    }

    constructor(dataset = {}, key) {
        super(dataset, key);
    }

    createDOM() {
        return document.createElement('div');
    }

    getDataset() {
        return super.getDataset();
    }

    updateDOM() {
        return false;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()}>
                <BookmarkNodeComponent
                    caption={this.__caption}
                    description={this.__description}
                    icon={this.__icon}
                    nodeKey={this.getKey()}
                    publisher={this.__publisher}
                    thumbnail={this.__thumbnail}
                    title={this.__title}
                    url={this.__url}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createBookmarkNode = (dataset) => {
    return new BookmarkNode(dataset);
};

export function $isBookmarkNode(node) {
    return node instanceof BookmarkNode;
}
