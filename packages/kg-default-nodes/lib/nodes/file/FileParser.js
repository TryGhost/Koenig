function sizeToBytes(string) {
    if (!string || string === '0 Byte') {
        return 0;
    }
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const parts = string.split(' ');
    const value = parseFloat(parts[0]);
    const unit = parts[1];

    if (!sizes.includes(unit)) {
        console.error('Invalid size unit'); // eslint-disable-line
    }

    const i = sizes.indexOf(unit);
    return Math.round(value * Math.pow(1024, i));
}

export class FileParser {
    constructor(NodeClass) {
        this.NodeClass = NodeClass;
    }

    get DOMConversionMap() {
        const self = this;

        return {
            div: (nodeElem) => {
                const isKgFileCard = nodeElem.classList?.contains('kg-file-card');
                if (nodeElem.tagName === 'DIV' && isKgFileCard) {
                    return {
                        conversion(domNode) {
                            const link = domNode.querySelector('a');
                            const src = link.getAttribute('href');
                            const title = domNode.querySelector('.kg-file-card-title')?.textContent || '';
                            const description = domNode.querySelector('.kg-file-card-caption')?.textContent || '';
                            const fileName = domNode.querySelector('.kg-file-card-filename')?.textContent || '';
                            let fileSize = domNode.querySelector('.kg-file-card-filesize')?.textContent || '';
                            if (fileSize) {
                                fileSize = sizeToBytes(fileSize);
                            }
                            const payload = {
                                src,
                                title,
                                description,
                                fileName,
                                fileSize
                            };

                            const node = new self.NodeClass(payload);
                            return {node};
                        },
                        priority: 1
                    };
                }
                return null;
            }
        };
    }
}
