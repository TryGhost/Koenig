import {addCreateDocumentOption} from '../../utils/add-create-document-option';
import {DateTime} from 'luxon';

export function renderCollectionNode(node, options = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument();

    const htmlString = cardTemplate(node);

    const element = document.createElement('div');
    element.innerHTML = htmlString?.trim();

    return {element: element.firstElementChild};
}

function cardTemplate(node) {
    const {collection, postCount, layout, columns, header} = node.getDataset();

    // we need to fetch and pass in post data to the renderer; unclear how we will implement this
    //  so for now, we'll just push in some test data
    const posts = testPostData;

    const headerClass = 'koenig-lexical-collection-heading whitespace-normal text-black dark:text-grey-50 opacity-100 pt-2 pb-4';
    const collectionClass = 'grid w-full'
        + (layout === 'list' ? ' gap-5' : '')
        + ((layout === 'grid' && columns === 1) ? ' grid-cols-1 gap-y-12' : '')
        + ((layout === 'grid' && columns === 2) ? ' grid-cols-2 gap-10' : '')
        + ((layout === 'grid' && columns === 3) ? ' grid-cols-3 gap-8' : '')
        + ((layout === 'grid' && columns === 4) ? ' grid-cols-4 gap-6' : '');

    return (
        `<div class="kg-card kg-collection-card" data-collection-slug="${collection.slug} data-collection-limit="${postCount}">
            <div class="kg-collection-card-header">
                <h2 class="${headerClass}">${header}</h2>
            </div>
            <div class="${collectionClass}">
                ${posts.map(post => postTemplate(post, layout, columns)).join('')}
            </div>
        </div>`
    );
}

function postTemplate(post, layout, columns) {
    const {title, published_at: publishDate, excerpt, feature_image: image, reading_time: readTime} = post;

    const imageWrapperClass = 'relative flex w-full items-center justify-center bg-grey-200 dark:bg-grey-950';
    const imageClass = 'w-full object-cover' 
        + ((layout === 'grid' && (columns === 1 || columns === 2)) ? ' aspect-video' : ' aspect-[3/2]')
        + (image === null ? ' invisible' : '');
    const titleClass = 'font-bold tracking-normal text-black dark:text-grey-100'
        + (layout === 'list' ? ' text-xl leading-snug' : '')
        + ((layout === 'grid' && columns === 1) ? ' text-4xl leading-tight' : '')
        + ((layout === 'grid' && columns === 2) ? ' text-2xl leading-snug' : '')
        + ((layout === 'grid' && columns === 3) ? ' text-xl leading-snug' : '')
        + ((layout === 'grid' && columns === 4) ? ' text-[1.7rem] leading-snug' : '');
    const excerptClass = 'overflow-y-hidden font-normal leading-snug text-grey-900 dark:text-grey-600'
        + (layout === 'list' ? ' mt-2 max-h-[62px] text-md line-clamp-3' : '')
        + ((layout === 'grid' && columns === 1) ? ' mt-3 max-h-[75px] text-lg line-clamp-3' : '')
        + ((layout === 'grid' && columns === 2) ? ' mt-3 max-h-[66px] text-[1.6rem] line-clamp-3' : '')
        + ((layout === 'grid' && columns === 3) ? ' mt-2 max-h-[42px] text-md line-clamp-2' : '')
        + ((layout === 'grid' && columns === 4) ? ' mt-2 max-h-[42px] text-md line-clamp-2' : '');
    const metaClass = 'flex font-normal leading-snug text-grey-600 dark:text-grey-400'
        + (layout === 'list' ? ' mt-2 text-md' : '')
        + ((layout === 'grid' && columns === 1) ? ' mt-3 text-lg' : '')
        + ((layout === 'grid' && columns === 2) ? ' mt-3 text-[1.6rem]' : '')
        + ((layout === 'grid' && columns === 3) ? ' mt-2 text-md' : '')
        + ((layout === 'grid' && columns === 4) ? ' mt-2 text-md' : '');

    return (
        `<div class="kg-collection-card-post">
            ${image && 
                `<div class=${imageWrapperClass}>
                    <img class=${imageClass} src="${image}" alt="${title}" />
                </div>`}
            <div class=${titleClass}>${title}</div>
            <div class=${excerptClass}>${excerpt}</div>
            <div class=${metaClass}>
                ${publishDate && `<div>${DateTime.fromISO(publishDate).toFormat('d LLL yyyy')}</div>`}
                ${readTime > 0 && `<div>&nbsp;&middot; ${readTime} min</div>`}
            </div>
        </div>`
    );
}

const testPostData = [
    {
        title: 'The Secret Life of Kittens: Uncovering Their Mischievous Master Plans',
        id: 1,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.floor(Math.random() * 100)}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/230/250',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Author McAuthory'
    },
    {
        title: 'Kittens Gone Wild: Epic Adventures of Feline Daredevils',
        id: 2,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/251/250',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Writer Writterson'
    },
    {
        title: 'The Kitten Olympics: Hilarious Competitions and Paw-some Winners',
        id: 3,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/249/251',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Author McAuthory'
    },
    {
        title: `Kitten Fashion Faux Paws: The Dos and Don'ts of Kitty Couture`,
        id: 4,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/245/250',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Author McAuthory'
    },
    {
        title: 'Kittens vs. Veggies: The Great Battle of Green Leafy Monsters',
        id: 5,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/251/255',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Writer Writterson'
    },
    {
        title: 'Kitten Karaoke Night: Unleashing the Musical Talents of Fluffy',
        id: 6,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/249/248',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Author McAuthory'
    },
    {
        title: `The Kitten's Guide to World Domination: Tips from Aspiring Dictators`,
        id: 7,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/248/250',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Author McAuthory'
    },
    {
        title: 'Kitten Yoga: Finding Inner Peace, One Stretch at a Time',
        id: 8,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/251/252',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Writer Writterson'
    },
    {
        title: 'The Purrfect Detective: Solving Mysteries with the Clueless Kitten Squad',
        id: 9,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/252/251',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Author McAuthory'
    },
    {
        title: 'Kitten IQ Test: Are You Smarter Than Your Whiskered Companion?',
        id: 10,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/250/252',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Author McAuthory'
    },
    {
        title: `The Catnip Chronicles: Tales of Kittens' Hilarious and Trippy Adventures`,
        id: 11,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/251/260',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Writer Writterson'
    },
    {
        title: `Kitten Celebrity Gossip: Who's Dating Whom in the Glamorous Feline World`,
        id: 12,
        url: 'https://www.google.com',
        published_at: DateTime.now().minus({days: Math.random() * 100}).toISO(),
        excerpt: 'Lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet lorem ipsum dolor amet',
        feature_image: 'https://placekitten.com/240/251',
        reading_time: Math.floor(Math.random() * 10),
        author: 'Author McAuthory'
    }
];