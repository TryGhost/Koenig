import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext.jsx';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar.jsx';
import {CollectionCard} from '../components/ui/cards/CollectionCard';
import {SnippetActionToolbar} from '../components/ui/SnippetActionToolbar.jsx';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function CollectionNodeComponent({collection, columns, layout, nodeKey, postCount, rows}) {
    const [editor] = useLexicalComposerContext();
    const {isEditing, isSelected, setEditing} = React.useContext(CardContext);
    const {cardConfig} = React.useContext(KoenigComposerContext);
    const [showSnippetToolbar, setShowSnippetToolbar] = React.useState(false);
    const [posts, setPosts] = React.useState([]);

    const maxPosts = 12;
    const maxRows = 6;
    const maxColumns = 4;

    const mockPosts = [
        {
            title: 'Post 1',
            id: 123456,
            url: 'https://www.google.com',
            excerpt: 'This is the excerpt for post 1',
            image: 'https://placekitten.com/250/250',
            author: 'Author 1'
        },
        {
            title: 'Post 2',
            id: 234059,
            url: 'https://www.google.com',
            excerpt: 'This is the excerpt for post 2',
            image: 'https://placekitten.com/251/250',
            author: 'Author 2'
        },
        {
            title: 'Post 3',
            id: 129837,
            url: 'https://www.google.com',
            excerpt: 'This is the excerpt for post 3',
            image: 'https://placekitten.com/249/251',
            author: 'Author 3'
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

    const handleColumnChange = (value) => {
        const isPlus = value === 1;
        if (isPlus) {
            if (columns >= maxColumns) {
                return;
            }
        } else if (columns <= 1) {
            return;
        }
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.columns = isPlus ? columns + 1 : columns - 1;
        });
    };

    const handlePostCountChange = (value) => {
        const isPlus = value === 1;
        if (isPlus) {
            if (postCount >= maxPosts) {
                return;
            }
        } else if (postCount <= 1) {
            return;
        }
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.postCount = isPlus ? postCount + 1 : postCount - 1;
        });
    };

    const handleRowChange = (value) => {
        // TODO: might need to show some kind of error when we max out the number of displayed posts
        const isPlus = value === 1;
        if (isPlus) {
            if (rows >= maxRows) {
                return;
            }
        } else if (rows <= 1) {
            return;
        }
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.rows = isPlus ? rows + 1 : rows - 1;
        });
        // if (canAddPosts(value, 'row')) {
        //     editor.update(() => {
        //         const node = $getNodeByKey(nodeKey);
        //         node.rows = value;
        //     });
        // }
    };

    // const canAddPosts = (value, source) => {
    //     if (source === 'rows') {
    //         if (value)
    //     }

    return (
        <>
            <CollectionCard
                collection={collection}
                columns={columns}
                handleCollectionChange={handleCollectionChange}
                handleColumnChange={handleColumnChange}
                handleLayoutChange={handleLayoutChange}
                handlePostCountChange={handlePostCountChange}
                handleRowChange={handleRowChange}
                isEditing={isEditing}
                layout={layout}
                postCount={postCount}
                posts={posts}
                rows={rows}
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