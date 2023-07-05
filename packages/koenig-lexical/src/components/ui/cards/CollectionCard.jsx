import PropTypes from 'prop-types';
import React from 'react';
import {ButtonGroupSetting, DropdownSetting, SettingsPanel} from '../SettingsPanel';
import {ReactComponent as CenterAlignIcon} from '../../../assets/icons/kg-align-center.svg';
import {ReactComponent as GalleryIcon} from '../../../assets/icons/kg-gallery-placeholder.svg';

export function CollectionPost({
    post,
    options
}) {
    return (
        <div>
            {options.hideFeatureImage
                ? null
                : <p>Feature Image</p>}
            <p>Post Title: {post && post.title}</p>
            {options.hideExcerpt
                ? null
                : <span>Excerpt</span>}
        </div>
    );
}

export function Collection({
    collection,
    columns,
    postCount,
    layout,
    rows
}) {
    // would apply appropriate container styles here for the respective format
    const listPosts = () => {
        collection.forEach((post) => {
            return (
                <div>
                    <CollectionPost post={post} />
                </div>
            );
        });
    };

    return (
        <div>
            {listPosts}
            <p>columns: {columns}</p>
            <p>postCount: {postCount}</p>
            <p>rows: {rows}</p>
            <p>layout: {layout}</p>
        </div>
    );
}

export function CollectionCard({
    collection,
    columns,
    layout,
    postCount,
    rows,
    handleCollectionChange,
    handleLayoutChange,
    isEditing
}) {
    const dropdownOptions = [{
        label: 'Free members',
        name: 'status:free'
    }, {
        label: 'Paid members',
        name: 'status:-free'
    }];

    const layoutOptions = [
        {
            label: 'Grid',
            name: 'grid',
            Icon: GalleryIcon,
            dataTestId: 'collection-layout-grid'
        },
        {
            label: 'List',
            name: 'list',
            Icon: CenterAlignIcon,
            dataTestId: 'collection-layout-list'
        }
    ];

    return (
        <>
            <div className="inline-block w-full">
                <Collection collection={collection} columns={columns} layout={layout} postCount={postCount} rows={rows} />
            </div>
            {isEditing && (
                <SettingsPanel>
                    <DropdownSetting
                        dataTestId='collections-dropdown'
                        label='Collections'
                        menu={dropdownOptions}
                        placeholder=''
                        onChange={handleCollectionChange}
                    />
                    <ButtonGroupSetting
                        collections={layoutOptions}
                        label="Content alignment"
                        selectedName={layout}
                        onClick={handleLayoutChange}
                    />
                    {layout === 'grid'
                    // TODO: add new settings component for +/-
                        ? <div>
                            <span>Columns: {columns}</span>
                            <span>Rows: {rows}</span>
                        </div>
                        : <div>
                            <span>Posts: {postCount}</span>
                        </div>
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
    collection: PropTypes.array,
    columns: PropTypes.number,
    layout: PropTypes.oneOf(['grid, list']),
    postCount: PropTypes.number,
    rows: PropTypes.number,
    handleCollectionChange: PropTypes.func,
    handleLayoutChange: PropTypes.func,
    isEditing: PropTypes.bool
};

Collection.propTypes = {
    collection: PropTypes.array,
    columns: PropTypes.number,
    layout: PropTypes.oneOf(['grid, list']),
    postCount: PropTypes.number,
    rows: PropTypes.number
};