import PropTypes from 'prop-types';
import React from 'react';
import {ButtonGroupSetting, DropdownSetting, SettingsPanel, SliderSetting} from '../SettingsPanel';
import {ReactComponent as GridLayoutIcon} from '../../../assets/icons/kg-layout-grid.svg';
import {ReactComponent as ListLayoutIcon} from '../../../assets/icons/kg-layout-list.svg';

export function CollectionPost({
    post,
    options
}) {
    // may want options later for changing post display (like hiding feature img)
    const {title, image, author, excerpt} = post;
    return (
        <div className='p-3'>
            <div className="not-kg-prose relative flex min-h-[120px] w-full bg-transparent font-sans">
                {image &&
                        (<div className={'grow-1 relative m-0 min-w-[33%]'}>
                            <img alt="" className="absolute inset-0 h-full w-full object-cover" src={image}/>
                        </div>)
                }
                <div className="flex grow basis-full flex-col items-start justify-start p-5">
                    {title && <div className="text-[1.5rem] font-semibold leading-normal tracking-normal text-grey-900 dark:text-grey-100">{title}</div>}
                    {author && <span className="text-[1.3rem]">by {author}</span>}
                    {excerpt && <div className="mt-1 max-h-[44px] overflow-y-hidden text-sm font-normal leading-normal text-grey-800 line-clamp-2 dark:text-grey-600">{excerpt}</div>}
                </div>
                <div className="absolute inset-0 z-50 mt-0"></div>
            </div>
        </div>
    );
}

export function Collection({
    posts,
    columns,
    postCount,
    layout
}) {
    // would apply appropriate container styles here for the respective format
    // also need to figure out how to handle placeholders if we should have a specific # showing
    //  in the editor vs. in the rendered post (handled by the renderer method)
    const ListPosts = posts && posts.map((post) => {
        return <CollectionPost key={post.id} post={post} />;
    });

    return (
        <div>
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
    handleCollectionChange,
    handleColumnChange,
    handleLayoutChange,
    handlePostCountChange,
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
            label: 'List',
            name: 'list',
            Icon: ListLayoutIcon
        },
        {
            label: 'Grid',
            name: 'grid',
            Icon: GridLayoutIcon
        }
    ];

    return (
        <>
            <div className="inline-block w-full">
                <Collection columns={columns} layout={layout} postCount={postCount} posts={posts} />
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
                    <SliderSetting
                        label="Post Count"
                        max={12}
                        min={1}
                        value={postCount}
                        onChange={handlePostCountChange}
                    />
                    {layout === 'grid' ?
                        <SliderSetting
                            label="Columns"
                            max={4}
                            min={1}
                            value={columns}
                            onChange={handleColumnChange}
                        />
                        : null
                    }
                </SettingsPanel>
            )}
        </>
    );
}

CollectionPost.propTypes = {
    post: PropTypes.object,
    options: PropTypes.object
};

CollectionCard.propTypes = {
    collection: PropTypes.object,
    columns: PropTypes.number,
    layout: PropTypes.oneOf(['list', 'grid']),
    postCount: PropTypes.number,
    posts: PropTypes.array,
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
    layout: PropTypes.oneOf(['list', 'grid']),
    postCount: PropTypes.number
};