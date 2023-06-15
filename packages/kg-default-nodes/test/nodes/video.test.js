const {JSDOM} = require('jsdom');
const {html} = require('../utils');
const {$getRoot} = require('lexical');
const {createHeadlessEditor} = require('@lexical/headless');
const {VideoNode, $createVideoNode, $isVideoNode} = require('../../');
const {$generateNodesFromDOM} = require('@lexical/html');

const editorNodes = [VideoNode];

describe('VideoNode', function () {
    let editor;
    let dataset;
    let exportOptions;

    // NOTE: all tests should use this function, without it you need manual
    // try/catch and done handling to avoid assertion failures not triggering
    // failed tests
    const editorTest = testFn => function (done) {
        editor.update(() => {
            try {
                testFn();
                done();
            } catch (e) {
                done(e);
            }
        });
    };

    beforeEach(function () {
        editor = createHeadlessEditor({nodes: editorNodes});

        dataset = {
            src: '/content/images/2022/11/koenig-lexical.mp4',
            caption: 'This is a <b>caption</b>',
            fileName: 'koenig-lexical.mp4',
            mimeType: 'video/mp4',
            width: 200,
            height: 100,
            duration: 60,
            thumbnailSrc: '/content/images/2022/11/koenig-lexical.jpg',
            customThumbnailSrc: '/content/images/2022/11/koenig-lexical-custom.jpg',
            thumbnailWidth: 100,
            thumbnailHeight: 50
        };

        exportOptions = new Object({
            createDocument: () => {
                return (new JSDOM()).window.document;
            }
        });
    });

    it('matches node with $isVideoNode', editorTest(function () {
        const videoNode = $createVideoNode(dataset);
        $isVideoNode(videoNode).should.be.true;
    }));

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const videoNode = $createVideoNode(dataset);

            videoNode.getSrc().should.equal(dataset.src);
            videoNode.getCaption().should.equal(dataset.caption);
            videoNode.getFileName().should.equal(dataset.fileName);
            videoNode.getMimeType().should.equal(dataset.mimeType);
            videoNode.getVideoWidth().should.equal(dataset.width);
            videoNode.getVideoHeight().should.equal(dataset.height);
            videoNode.getDuration().should.equal(dataset.duration);
            videoNode.getThumbnailSrc().should.equal(dataset.thumbnailSrc);
            videoNode.getCustomThumbnailSrc().should.equal(dataset.customThumbnailSrc);
            videoNode.getThumbnailWidth().should.equal(dataset.thumbnailWidth);
            videoNode.getThumbnailHeight().should.equal(dataset.thumbnailHeight);
            videoNode.getCardWidth().should.equal('regular');
            videoNode.getLoop().should.be.false;
        }));

        it('has setters for all properties', editorTest(function () {
            const videoNode = $createVideoNode();

            videoNode.getSrc().should.equal('');
            videoNode.setSrc('/content/images/2022/12/koenig-lexical.mp4');
            videoNode.getSrc().should.equal('/content/images/2022/12/koenig-lexical.mp4');

            videoNode.getCaption().should.equal('');
            videoNode.setCaption('Caption');
            videoNode.getCaption().should.equal('Caption');

            videoNode.getFileName().should.equal('');
            videoNode.setFileName('koenig-lexical.mp4');
            videoNode.getFileName().should.equal('koenig-lexical.mp4');

            videoNode.getMimeType().should.equal('');
            videoNode.setMimeType('video/mp4');
            videoNode.getMimeType().should.equal('video/mp4');

            should(videoNode.getVideoWidth()).equal(null);
            videoNode.setVideoWidth(600);
            videoNode.getVideoWidth().should.equal(600);

            should(videoNode.getVideoHeight()).equal(null);
            videoNode.setVideoHeight(700);
            videoNode.getVideoHeight().should.equal(700);

            videoNode.getDuration().should.equal(0);
            videoNode.setDuration(70);
            videoNode.getDuration().should.equal(70);

            videoNode.getThumbnailSrc().should.equal('');
            videoNode.setThumbnailSrc('/content/images/2022/12/koenig-lexical.png');
            videoNode.getThumbnailSrc().should.equal('/content/images/2022/12/koenig-lexical.png');

            videoNode.getCustomThumbnailSrc().should.equal('');
            videoNode.setCustomThumbnailSrc('/content/images/2022/12/koenig-lexical-custom.png');
            videoNode.getCustomThumbnailSrc().should.equal('/content/images/2022/12/koenig-lexical-custom.png');

            should(videoNode.getThumbnailWidth()).equal(null);
            videoNode.setThumbnailWidth(100);
            videoNode.getThumbnailWidth().should.equal(100);

            should(videoNode.getThumbnailHeight()).equal(null);
            videoNode.setThumbnailHeight(200);
            videoNode.getThumbnailHeight().should.equal(200);

            videoNode.getCardWidth().should.equal('regular');
            videoNode.setCardWidth('wide');
            videoNode.getCardWidth().should.equal('wide');

            videoNode.getLoop().should.be.false;
            videoNode.setLoop(true);
            videoNode.getLoop().should.be.true;
        }));

        it('has getDataset() convenience method', editorTest(function () {
            const videoNode = $createVideoNode(dataset);
            const videoNodeDataset = videoNode.getDataset();

            videoNodeDataset.should.deepEqual({
                ...dataset,
                cardWidth: 'regular',
                loop: false
            });
        }));

        it('can format duration', editorTest(function () {
            const videoNode = $createVideoNode(dataset);

            videoNode.setDuration(60);
            videoNode.getFormattedDuration().should.equal('1:00');

            videoNode.setDuration(30);
            videoNode.getFormattedDuration().should.equal('0:30');

            videoNode.setDuration(0);
            videoNode.getFormattedDuration().should.equal('0:00');

            videoNode.setDuration(78);
            videoNode.getFormattedDuration().should.equal('1:18');
        }));
    });

    describe('exportJSON', function () {
        it('contains all data', editorTest(function () {
            dataset.cardWidth = 'wide';

            const videoNode = $createVideoNode(dataset);
            const json = videoNode.exportJSON();

            json.should.deepEqual({
                type: 'video',
                version: 1,
                src: dataset.src,
                caption: dataset.caption,
                fileName: dataset.fileName,
                mimeType: dataset.mimeType,
                width: dataset.width,
                height: dataset.height,
                duration: dataset.duration,
                thumbnailSrc: dataset.thumbnailSrc,
                customThumbnailSrc: dataset.customThumbnailSrc,
                thumbnailWidth: dataset.thumbnailWidth,
                thumbnailHeight: dataset.thumbnailHeight,
                cardWidth: dataset.cardWidth,
                loop: false
            });
        }));
    });

    describe('importJSON', function () {
        it('imports all data', function (done) {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'video',
                        ...dataset,
                        cardWidth: 'wide',
                        loop: true
                    }],
                    direction: null,
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            });

            const editorState = editor.parseEditorState(serializedState);
            editor.setEditorState(editorState);

            editor.getEditorState().read(() => {
                try {
                    const [videoNode] = $getRoot().getChildren();

                    videoNode.getSrc().should.equal(dataset.src);
                    videoNode.getCaption().should.equal(dataset.caption);
                    videoNode.getFileName().should.equal(dataset.fileName);
                    videoNode.getMimeType().should.equal(dataset.mimeType);
                    videoNode.getVideoWidth().should.equal(dataset.width);
                    videoNode.getVideoHeight().should.equal(dataset.height);
                    videoNode.getDuration().should.equal(dataset.duration);
                    videoNode.getThumbnailSrc().should.equal(dataset.thumbnailSrc);
                    videoNode.getCustomThumbnailSrc().should.equal(dataset.customThumbnailSrc);
                    videoNode.getThumbnailWidth().should.equal(dataset.thumbnailWidth);
                    videoNode.getThumbnailHeight().should.equal(dataset.thumbnailHeight);
                    videoNode.getCardWidth().should.equal('wide');
                    videoNode.getLoop().should.be.true;

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });

    describe('exportDOM', function () {
        it('renders', editorTest(function () {
            const payload = {
                src: '/content/images/2022/11/koenig-lexical.mp4',
                width: 200,
                height: 100,
                duration: 60,
                thumbnailSrc: '/content/images/2022/11/koenig-lexical.jpg'
            };
            const videoNode = $createVideoNode(payload);
            const {element} = videoNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(html`
                <figure class="kg-card kg-video-card kg-width-regular" data-kg-thumbnail="/content/images/2022/11/koenig-lexical.jpg" data-kg-custom-thumbnail="">
                    <div class="kg-video-container">
                        <video
                            src="/content/images/2022/11/koenig-lexical.mp4"
                            poster="https://img.spacergif.org/v1/200x100/0a/spacer.png"
                            width="200"
                            height="100"
                            playsinline=""
                            preload="metadata"
                            style="background: transparent url('/content/images/2022/11/koenig-lexical.jpg') 50% 50% / cover no-repeat;"
                        ></video>
                        <div class="kg-video-overlay">
                            <button class="kg-video-large-play-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="kg-video-player-container">
                            <div class="kg-video-player">
                                <button class="kg-video-play-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path>
                                    </svg>
                                </button>
                                <button class="kg-video-pause-icon kg-video-hide">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <rect x="3" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect>
                                        <rect x="14" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect>
                                    </svg>
                                </button>
                                <span class="kg-video-current-time">0:00</span>
                                <div class="kg-video-time">
                                    /<span class="kg-video-duration">1:00</span>
                                </div>
                                <input type="range" class="kg-video-seek-slider" max="100" value="0">
                                <button class="kg-video-playback-rate">1×</button>
                                <button class="kg-video-unmute-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M15.189 2.021a9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1.794a.249.249 0 0 1 .221.133 9.73 9.73 0 0 0 7.924 4.85h.06a1 1 0 0 0 1-1V3.02a1 1 0 0 0-1.06-.998Z"></path>
                                    </svg>
                                </button>
                                <button class="kg-video-mute-icon kg-video-hide">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M16.177 4.3a.248.248 0 0 0 .073-.176v-1.1a1 1 0 0 0-1.061-1 9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h.114a.251.251 0 0 0 .177-.073ZM23.707 1.706A1 1 0 0 0 22.293.292l-22 22a1 1 0 0 0 0 1.414l.009.009a1 1 0 0 0 1.405-.009l6.63-6.631A.251.251 0 0 1 8.515 17a.245.245 0 0 1 .177.075 10.081 10.081 0 0 0 6.5 2.92 1 1 0 0 0 1.061-1V9.266a.247.247 0 0 1 .073-.176Z"></path>
                                    </svg>
                                </button>
                                <input type="range" class="kg-video-volume-slider" max="100" value="100">
                            </div>
                        </div>
                    </div>
                </figure>
            `);
        }));

        it('renders for email target', editorTest(function () {
            const payload = {
                src: '/content/images/2022/11/koenig-lexical.mp4',
                width: 200,
                height: 100,
                duration: 60,
                thumbnailSrc: '/content/images/2022/11/koenig-lexical.jpg'
            };

            const options = {
                target: 'email',
                postUrl: 'https://example.com/my-post'
            };
            const videoNode = $createVideoNode(payload);
            const {element} = videoNode.exportDOM({...exportOptions, ...options});
            const output = element.outerHTML;

            output.should.not.containEql('<video');
            output.should.containEql('<figure class="kg-card kg-video-card kg-width-regular"');
            output.should.containEql('<a class="kg-video-preview" href="https://example.com/my-post"');
            output.should.containEql('background="/content/images/2022/11/koenig-lexical.jpg"');
        }));

        it('renders card width', editorTest(function () {
            const payload = {
                src: '/content/images/2022/11/koenig-lexical.mp4',
                width: 200,
                height: 100,
                duration: 60,
                thumbnailSrc: '/content/images/2022/11/koenig-lexical.jpg',
                cardWidth: 'wide'
            };

            const videoNode = $createVideoNode(payload);
            const {element} = videoNode.exportDOM(exportOptions);
            const output = element.outerHTML;
            output.should.containEql('kg-card kg-video-card kg-width-wide');
        }));

        it('renders loop attribute', editorTest(function () {
            const payload = {
                src: '/content/images/2022/11/koenig-lexical.mp4',
                width: 200,
                height: 100,
                duration: 60,
                thumbnailSrc: '/content/images/2022/11/koenig-lexical.jpg',
                loop: true
            };

            const videoNode = $createVideoNode(payload);
            const {element} = videoNode.exportDOM(exportOptions);
            const output = element.outerHTML;
            output.should.containEql('loop');
        }));

        it('renders caption when provided', editorTest(function () {
            const payload = {
                src: '/content/images/2022/11/koenig-lexical.mp4',
                width: 200,
                height: 100,
                duration: 60,
                thumbnailSrc: '/content/images/2022/11/koenig-lexical.jpg',
                caption: '<strong>Caption</strong>'
            };

            const videoNode = $createVideoNode(payload);
            const {element} = videoNode.exportDOM(exportOptions);
            const output = element.outerHTML;
            output.should.containEql('<figure class="kg-card kg-video-card kg-width-regular kg-card-hascaption"');
            output.should.containEql('<figcaption><strong>Caption</strong></figcaption>');
        }));
    });

    describe('hasEditMode', function () {
        it('returns true', editorTest(function () {
            const videoNode = $createVideoNode(dataset);
            videoNode.hasEditMode().should.be.true;
        }));
    });

    describe('importDOM', function () {
        it('parses video card', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure class="kg-card kg-video-card kg-width-regular" data-kg-thumbnail="/content/images/2022/11/koenig-lexical.jpg" data-kg-custom-thumbnail=""> <div class="kg-video-container"> <video src="/content/images/2022/11/koenig-lexical.mp4" poster="https://img.spacergif.org/v1/200x100/0a/spacer.png" width="200" height="100" playsinline="" preload="metadata" style="background: transparent url('/content/images/2022/11/koenig-lexical.jpg') 50% 50% / cover no-repeat;" ></video> <div class="kg-video-overlay"> <button class="kg-video-large-play-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path> </svg> </button> </div><div class="kg-video-player-container"> <div class="kg-video-player"> <button class="kg-video-play-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path> </svg> </button> <button class="kg-video-pause-icon kg-video-hide"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <rect x="3" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect> <rect x="14" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect> </svg> </button> <span class="kg-video-current-time">0:00</span> <div class="kg-video-time"> /<span class="kg-video-duration">1:00</span> </div><input type="range" class="kg-video-seek-slider" max="100" value="0"> <button class="kg-video-playback-rate">1×</button> <button class="kg-video-unmute-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M15.189 2.021a9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1.794a.249.249 0 0 1 .221.133 9.73 9.73 0 0 0 7.924 4.85h.06a1 1 0 0 0 1-1V3.02a1 1 0 0 0-1.06-.998Z"></path> </svg> </button> <button class="kg-video-mute-icon kg-video-hide"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M16.177 4.3a.248.248 0 0 0 .073-.176v-1.1a1 1 0 0 0-1.061-1 9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h.114a.251.251 0 0 0 .177-.073ZM23.707 1.706A1 1 0 0 0 22.293.292l-22 22a1 1 0 0 0 0 1.414l.009.009a1 1 0 0 0 1.405-.009l6.63-6.631A.251.251 0 0 1 8.515 17a.245.245 0 0 1 .177.075 10.081 10.081 0 0 0 6.5 2.92 1 1 0 0 0 1.061-1V9.266a.247.247 0 0 1 .073-.176Z"></path> </svg> </button> <input type="range" class="kg-video-volume-slider" max="100" value="100"> </div></div></div><figcaption>Video caption</figcaption></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);
            nodes[0].getSrc().should.equal('/content/images/2022/11/koenig-lexical.mp4');
            nodes[0].getVideoWidth().should.equal(200);
            nodes[0].getVideoHeight().should.equal(100);
            nodes[0].getThumbnailSrc().should.equal('/content/images/2022/11/koenig-lexical.jpg');
            nodes[0].getCustomThumbnailSrc().should.equal('');
            nodes[0].getDuration().should.equal(60);
            nodes[0].getLoop().should.be.false;
            nodes[0].getCaption().should.equal('Video caption');
            nodes[0].getCardWidth().should.equal('regular');
        }));

        it('parses video card without caption', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure class="kg-card kg-video-card kg-width-regular" data-kg-thumbnail="/content/images/2022/11/koenig-lexical.jpg" data-kg-custom-thumbnail=""> <div class="kg-video-container"> <video src="/content/images/2022/11/koenig-lexical.mp4" poster="https://img.spacergif.org/v1/200x100/0a/spacer.png" width="200" height="100" playsinline="" preload="metadata" style="background: transparent url('/content/images/2022/11/koenig-lexical.jpg') 50% 50% / cover no-repeat;" ></video> <div class="kg-video-overlay"> <button class="kg-video-large-play-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path> </svg> </button> </div><div class="kg-video-player-container"> <div class="kg-video-player"> <button class="kg-video-play-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path> </svg> </button> <button class="kg-video-pause-icon kg-video-hide"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <rect x="3" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect> <rect x="14" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect> </svg> </button> <span class="kg-video-current-time">0:00</span> <div class="kg-video-time"> /<span class="kg-video-duration">1:00</span> </div><input type="range" class="kg-video-seek-slider" max="100" value="0"> <button class="kg-video-playback-rate">1×</button> <button class="kg-video-unmute-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M15.189 2.021a9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1.794a.249.249 0 0 1 .221.133 9.73 9.73 0 0 0 7.924 4.85h.06a1 1 0 0 0 1-1V3.02a1 1 0 0 0-1.06-.998Z"></path> </svg> </button> <button class="kg-video-mute-icon kg-video-hide"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M16.177 4.3a.248.248 0 0 0 .073-.176v-1.1a1 1 0 0 0-1.061-1 9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h.114a.251.251 0 0 0 .177-.073ZM23.707 1.706A1 1 0 0 0 22.293.292l-22 22a1 1 0 0 0 0 1.414l.009.009a1 1 0 0 0 1.405-.009l6.63-6.631A.251.251 0 0 1 8.515 17a.245.245 0 0 1 .177.075 10.081 10.081 0 0 0 6.5 2.92 1 1 0 0 0 1.061-1V9.266a.247.247 0 0 1 .073-.176Z"></path> </svg> </button> <input type="range" class="kg-video-volume-slider" max="100" value="100"> </div></div></div></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);
            nodes[0].getCaption().should.equal('');
        }));

        it('parses video card with custom thumbnail', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure class="kg-card kg-video-card kg-width-regular" data-kg-thumbnail="" data-kg-custom-thumbnail="/content/images/2022/11/koenig-lexical-custom.jpg"> <div class="kg-video-container"> <video src="/content/images/2022/11/koenig-lexical.mp4" poster="https://img.spacergif.org/v1/200x100/0a/spacer.png" width="200" height="100" playsinline="" preload="metadata" style="background: transparent url('/content/images/2022/11/koenig-lexical.jpg') 50% 50% / cover no-repeat;" ></video> <div class="kg-video-overlay"> <button class="kg-video-large-play-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path> </svg> </button> </div><div class="kg-video-player-container"> <div class="kg-video-player"> <button class="kg-video-play-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path> </svg> </button> <button class="kg-video-pause-icon kg-video-hide"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <rect x="3" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect> <rect x="14" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect> </svg> </button> <span class="kg-video-current-time">0:00</span> <div class="kg-video-time"> /<span class="kg-video-duration">1:00</span> </div><input type="range" class="kg-video-seek-slider" max="100" value="0"> <button class="kg-video-playback-rate">1×</button> <button class="kg-video-unmute-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M15.189 2.021a9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1.794a.249.249 0 0 1 .221.133 9.73 9.73 0 0 0 7.924 4.85h.06a1 1 0 0 0 1-1V3.02a1 1 0 0 0-1.06-.998Z"></path> </svg> </button> <button class="kg-video-mute-icon kg-video-hide"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M16.177 4.3a.248.248 0 0 0 .073-.176v-1.1a1 1 0 0 0-1.061-1 9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h.114a.251.251 0 0 0 .177-.073ZM23.707 1.706A1 1 0 0 0 22.293.292l-22 22a1 1 0 0 0 0 1.414l.009.009a1 1 0 0 0 1.405-.009l6.63-6.631A.251.251 0 0 1 8.515 17a.245.245 0 0 1 .177.075 10.081 10.081 0 0 0 6.5 2.92 1 1 0 0 0 1.061-1V9.266a.247.247 0 0 1 .073-.176Z"></path> </svg> </button> <input type="range" class="kg-video-volume-slider" max="100" value="100"> </div></div></div></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);
            nodes[0].getThumbnailSrc().should.equal('');
            nodes[0].getCustomThumbnailSrc().should.equal('/content/images/2022/11/koenig-lexical-custom.jpg');
        }));
    });

    describe('getTextContent', function () {
        it('returns contents', editorTest(function () {
            const node = $createVideoNode();
            node.getTextContent().should.equal('');

            node.setCaption('Test caption');
            node.getTextContent().should.equal('Test caption\n\n');
        }));
    });
});
