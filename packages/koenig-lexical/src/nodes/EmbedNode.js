import {ElementNode, createCommand} from 'lexical';
import {ReactComponent as UnsplashIcon} from '../assets/icons/kg-card-type-unsplash.svg';
import {ReactComponent as YouTubeIcon} from '../assets/icons/kg-card-type-youtube.svg';

export const INSERT_UNSPLASH_COMMAND = createCommand();

// Parent node for embed nodes
export class EmbedNode extends ElementNode {
    static clone() {
        return false;
    }
    static getType() {
        return 'embed';
    }

    static importJSON(){
        return false;
    }
    // collection of embed cards
    static kgMenu = [{
        section: 'Embed',
        label: 'Unsplash',
        desc: '/unsplash [search term or url]',
        Icon: UnsplashIcon,
        insertCommand: INSERT_UNSPLASH_COMMAND,
        insertParams: {
            triggerFileDialog: false
        },
        matches: ['image', 'img'],
        queryParams: ['src']
    },
    {
        section: 'Embed',
        label: 'YouTube',
        desc: '/youtube [search term or url]',
        Icon: YouTubeIcon,
        insertCommand: '',
        insertParams: {
            triggerFileDialog: false
        },
        matches: ['image', 'img'],
        queryParams: ['src']
    }];
    constructor() {
        super('embed');
    }
    updateDOM() {
        return false;
    }
    exportJSON(){
        return false;
    }
}
