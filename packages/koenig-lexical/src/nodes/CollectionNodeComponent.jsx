import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext.jsx';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar.jsx';
import {CollectionCard} from '../components/ui/cards/CollectionCard';
import {SnippetActionToolbar} from '../components/ui/SnippetActionToolbar.jsx';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function CollectionNodeComponent({collection, columns, layout, nodeKey, postCount}) {
    const [editor] = useLexicalComposerContext();
    const {isEditing, isSelected, setEditing} = React.useContext(CardContext);
    const {cardConfig} = React.useContext(KoenigComposerContext);
    const [showSnippetToolbar, setShowSnippetToolbar] = React.useState(false);
    const [posts, setPosts] = React.useState([]);

    const mockPosts = [
        {
            title: 'A Post For The Ages',
            id: 123456,
            url: 'https://www.google.com',
            excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
            image: 'https://placekitten.com/250/250',
            author: 'Author McAuthory'
        },
        {
            title: 'Copilot Needs A Post',
            id: 234059,
            url: 'https://www.google.com',
            excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
            image: 'https://placekitten.com/251/250',
            author: 'Writer Writterson'
        },
        {
            title: 'More Suggestions Please And Thank You',
            id: 129837,
            url: 'https://www.google.com',
            excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
            image: 'https://placekitten.com/249/251',
            author: 'Author McAuthory'
        }
    ];

    React.useEffect(() => {
        if (collection) {
            // fetch collection data
            const postData = mockPosts;
            setPosts(postData);
            console.log(`postData`, postData);
        }
    }, [collection]);

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
    };

    const handleCollectionChange = (value) => {
        // TODO: need to refresh the collection data - so we need to make a content API request here
        console.log(`collection change`,value);
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.collection = {id: value};
        });
    };

    const handleLayoutChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.layout = value;
        });
    };

    const handleColumnChange = (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.columns = parseInt(event.target.value);
        });
    };

    const handlePostCountChange = (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.postCount = parseInt(event.target.value);
        });
    };

    return (
        <>
            <CollectionCard
                collection={collection}
                columns={columns}
                handleCollectionChange={handleCollectionChange}
                handleColumnChange={handleColumnChange}
                handleLayoutChange={handleLayoutChange}
                handlePostCountChange={handlePostCountChange}
                isEditing={isEditing}
                layout={layout}
                postCount={postCount}
                posts={posts}
            />
            <ActionToolbar
                data-kg-card-toolbar="collection"
                isVisible={showSnippetToolbar}
            >
                <SnippetActionToolbar onClose={() => setShowSnippetToolbar(false)} />
            </ActionToolbar>

            <ActionToolbar
                data-kg-card-toolbar="collection"
                isVisible={isSelected && !isEditing}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem dataTestId="edit-collection-card" icon="edit" isActive={false} label="Edit" onClick={handleToolbarEdit} />
                    <ToolbarMenuSeparator hide={!cardConfig.createSnippet} />
                    <ToolbarMenuItem
                        dataTestId="create-snippet"
                        hide={!cardConfig.createSnippet}
                        icon="snippet"
                        isActive={false}
                        label="Create snippet"
                        onClick={() => setShowSnippetToolbar(true)}
                    />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}