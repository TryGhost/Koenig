import PropTypes from 'prop-types';
import React from 'react';
import {BookmarkIcon} from './BookmarkCard';
import {ButtonGroupSetting, DropdownSetting, SettingsPanel} from '../SettingsPanel';
import {ReactComponent as CenterAlignIcon} from '../../../assets/icons/kg-align-center.svg';
import {ReactComponent as LeftAlignIcon} from '../../../assets/icons/kg-align-left.svg';

export function CollectionPost({
    post,
    options
}) {
    // may want options later for changing post display (like hiding feature img)
    return (
        <div className='p-3'>
            <img alt={post.title} src={post.image}></img>
            <h6>{post.title}</h6>
            <p>{post.author}</p>
            <p>{post.excerpt}</p>
        </div>
    );
}

export function Collection({
    posts,
    columns,
    postCount,
    layout,
    rows
}) {
    // would apply appropriate container styles here for the respective format
    const ListPosts = posts.map((post) => {
        return <CollectionPost key={post.id} post={post} />;
    });

    return (
        <div className='flex flex-row justify-center'>
            {ListPosts}
        </div>
    );
}

export function CollectionCard({
    collection,
    columns,
    layout,
    postCount,
    posts,
    rows,
    handleCollectionChange,
    handleColumnChange,
    handleLayoutChange,
    handlePostCountChange,
    handleRowChange,
    isEditing
}) {
    const collectionOptions = [{
        label: 'Latest',
        name: 123456
    }, {
        label: 'Featured',
        name: 987654
    }];

    const layoutOptions = [
        {
            label: 'Grid',
            name: 'grid',
            Icon: LeftAlignIcon
        },
        {
            label: 'List',
            name: 'list',
            Icon: CenterAlignIcon
        }
    ];

    const incrementerOptions = [
        {
            label: '-',
            name: -1
        },
        {
            label: '+',
            name: 1
        }
    ];

    return (
        <>
            <div className="inline-block w-full">
                <Collection columns={columns} layout={layout} postCount={postCount} posts={posts} rows={rows} />
            </div>
            {isEditing && (
                <SettingsPanel>
                    <DropdownSetting
                        dataTestId='collections-dropdown'
                        label='Collection'
                        menu={collectionOptions}
                        value={collection?.id}
                        onChange={handleCollectionChange}
                    />
                    <ButtonGroupSetting
                        buttons={layoutOptions}
                        label="Layout"
                        selectedName={layout}
                        onClick={handleLayoutChange}
                    />
                    {layout === 'grid'
                    // TODO: add new settings component for +/-
                        ?
                        <>
                            <ButtonGroupSetting
                                buttons={incrementerOptions}
                                label={`Rows: ${rows}`}
                                onClick={handleRowChange}
                            />
                            <ButtonGroupSetting
                                buttons={incrementerOptions}
                                label={`Columns: ${columns}`}
                                onClick={handleColumnChange}
                            />
                        </>
                        :
                        <ButtonGroupSetting
                            buttons={incrementerOptions}
                            label={`Number of posts: ${postCount}`}
                            onClick={handlePostCountChange}
                        />
                    }
                </SettingsPanel>
            )}
        </>
    );
}

CollectionPost.propTypes = {
    key: PropTypes.number,
    post: PropTypes.object,
    options: PropTypes.object
};

CollectionCard.propTypes = {
    collection: PropTypes.object,
    columns: PropTypes.number,
    layout: PropTypes.oneOf(['grid', 'list']),
    postCount: PropTypes.number,
    posts: PropTypes.array,
    rows: PropTypes.number,
    handleCollectionChange: PropTypes.func,
    handleColumnChange: PropTypes.func,
    handleLayoutChange: PropTypes.func,
    handlePostCountChange: PropTypes.func,
    handleRowChange: PropTypes.func,
    isEditing: PropTypes.bool
};

Collection.propTypes = {
    posts: PropTypes.array,
    columns: PropTypes.number,
    layout: PropTypes.oneOf(['grid', 'list']),
    postCount: PropTypes.number,
    rows: PropTypes.number
};