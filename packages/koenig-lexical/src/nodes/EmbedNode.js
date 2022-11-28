import {ElementNode, createCommand} from 'lexical';
import {INSERT_IMAGE_COMMAND} from '../nodes/ImageNode';
import {ReactComponent as UnsplashIcon} from '../assets/icons/kg-card-type-unsplash.svg';

export const INSERT_UNSPLASH_EMBED_COMMAND = createCommand();

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
        insertCommand: INSERT_IMAGE_COMMAND,
        insertParams: {
            triggerFileDialog: false,
            service: 'unsplash'
        },
        matches: ['/unsplash'],
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
