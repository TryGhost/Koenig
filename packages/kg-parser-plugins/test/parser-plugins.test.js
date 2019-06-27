// Switch these lines once there are useful utils
// const testUtils = require('./utils');
require('./utils');

const {JSDOM} = require('jsdom');
const {createParserPlugins} = require('../');
const PostNodeBuilder = require('@tryghost/mobiledoc-kit/dist/commonjs/mobiledoc-kit/models/post-node-builder').default;
const DOMParser = require('@tryghost/mobiledoc-kit/dist/commonjs/mobiledoc-kit/parsers/dom').default;

const buildDOM = function (html) {
    // the <body> wrapper is needed to retain the first comment if `html` starts
    // with one, this matches general DOM Parsing behaviour so we should always
    // be careful to wrap content any time we're converting fragments
    return (new JSDOM(`<body>${html}</body>`)).window.document.body;
};

describe('parser-plugins', function () {
    let builder, parser;

    const plugins = createParserPlugins({
        createDocument(html) {
            return (new JSDOM(html)).window.document;
        }
    });

    beforeEach(function () {
        builder = new PostNodeBuilder();
        parser = new DOMParser(builder, {plugins});
    });

    afterEach(function () {
        builder = null;
        parser = null;
    });

    describe('createParserPlugins', function () {
        it('errors in Node.js env without a `createDocument` option', function () {
            should(function () {
                createParserPlugins();
            }).throw('createParserPlugins() must be passed a `createDocument` function as an option when used in a non-browser environment');
        });
    });

    describe('kgHtmlCardToCard', function () {
        it('parses html wrapped in html card comments into card code', function () {
            const dom = buildDOM('<!--kg-card-begin: html--><div><span>Custom HTML</span></div><!--kg-card-end: html-->');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('html');
            section.payload.html.should.equal('<div><span>Custom HTML</span></div>');
        });

        it('skips other parser plugins', function () {
            const dom = buildDOM('<!--kg-card-begin: html--><img src="http://example.com/image.png"><!--kg-card-end: html-->');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('html');
            section.payload.html.should.equal('<img src="http://example.com/image.png">');
        });

        it('works with surrounding content', function () {
            const dom = buildDOM('<p>One</p>\n<!--kg-card-begin: html-->\n<img src="http://example.com/image.png">\n<!--kg-card-end: html-->\n<p><img src="http://example.com/image2.png"></p>');
            const sections = parser.parse(dom).sections.toArray();
            sections.length.should.equal(3);

            const [p, html, image] = sections;

            p.type.should.equal('markup-section');
            p.markers.head.value.should.equal('One');

            html.type.should.equal('card-section');
            html.name.should.equal('html');
            html.payload.html.should.equal('<img src="http://example.com/image.png">');

            image.type.should.equal('card-section');
            image.name.should.equal('image');
            image.payload.src.should.equal('http://example.com/image2.png');
        });
    });

    describe('brToSoftBreakAtom', function () {
        it('parses BR tags to soft-return atoms', function () {
            const dom = buildDOM('Testing<br>Soft-return');

            const [section] = parser.parse(dom).sections.toArray();
            section.tagName.should.equal('p');

            const markers = section.markers.toArray();
            markers.length.should.equal(3);

            const [text1, atom, text2] = markers;
            text1.value.should.equal('Testing');
            atom.name.should.equal('soft-return');
            text2.value.should.equal('Soft-return');
        });
    });

    describe('removeLeadingNewline', function () {
        it('strips newline chars from the beginning of text nodes', function () {
            const dom = buildDOM('<p>\nTesting</p>');

            const [section] = parser.parse(dom).sections.toArray();
            const [marker] = section.markers.toArray();

            marker.value.should.equal('Testing');
        });
    });

    describe('figureToImageCard', function () {
        it('parses IMG inside FIGURE to image card without caption', function () {
            const dom = buildDOM('<figure><img src="http://example.com/test.png" alt="Alt test" title="Title test"></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('image');
            section.payload.should.deepEqual({
                src: 'http://example.com/test.png',
                alt: 'Alt test',
                title: 'Title test'
            });
        });

        it('parses IMG inside FIGURE to image card with caption', function () {
            const dom = buildDOM('<figure><img src="http://example.com/test.png"><figcaption>&nbsp; <strong>Caption test</strong></figcaption></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.payload.should.deepEqual({
                src: 'http://example.com/test.png',
                alt: '',
                title: '',
                caption: '<strong>Caption test</strong>'
            });
        });

        it('extracts Koenig card widths', function () {
            const dom = buildDOM('<figure class="kg-card kg-width-wide"><img src="http://example.com/test.png"></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.payload.cardWidth.should.equal('wide');
        });

        it('extracts Medium card widths', function () {
            const dom = buildDOM('<figure class="graf--layoutFillWidth"><img src="http://example.com/test.png"></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.payload.cardWidth.should.equal('full');
        });
    });

    describe('imgToCard', function () {
        it('parses IMG into image card', function () {
            const dom = buildDOM('<img src="http://example.com/test.png" alt="Alt test" title="Title test">');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('image');
            section.payload.should.deepEqual({
                src: 'http://example.com/test.png',
                alt: 'Alt test',
                title: 'Title test'
            });
        });
    });

    describe('hrToCard', function () {
        it('parses HR into hr card', function () {
            const dom = buildDOM('<p>Test 1</p><hr><p>Test 2</p>');
            const [p1, hr, p2] = parser.parse(dom).sections.toArray();

            p1.tagName.should.equal('p');
            p1.markers.head.value.should.equal('Test 1');

            hr.type.should.equal('card-section');
            hr.name.should.equal('hr');

            p2.tagName.should.equal('p');
            p2.markers.head.value.should.equal('Test 2');
        });
    });

    describe('figureToCodeCard', function () {
        it('parses PRE>CODE inside FIGURE into code card', function () {
            // NOTE: skipped and picked up by preCodeToCard
            const dom = buildDOM('<figure><pre><code>Test code</code></pre></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('code');
            section.payload.should.deepEqual({
                code: 'Test code'
            });
        });

        it('parses PRE>CODE inside FIGURE with FIGCAPTION into code card', function () {
            const dom = buildDOM('<figure><pre><code>Test code</code></pre><figcaption>Test caption</figcaption></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('code');
            section.payload.should.deepEqual({
                code: 'Test code',
                caption: 'Test caption'
            });
        });

        it('extracts language from pre class name', function () {
            const dom = buildDOM('<figure><pre class="language-js"><code>Test code</code></pre><figcaption>Test caption</figcaption></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('code');
            section.payload.should.deepEqual({
                code: 'Test code',
                caption: 'Test caption',
                language: 'js'
            });
        });

        it('extracts language from code class name', function () {
            const dom = buildDOM('<figure><pre><code class="language-js">Test code</code></pre><figcaption>Test caption</figcaption></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('code');
            section.payload.should.deepEqual({
                code: 'Test code',
                caption: 'Test caption',
                language: 'js'
            });
        });

        it('correctly skips if there is no pre tag', function () {
            const dom = buildDOM('<figure><div><span class="nothing-to-see-here"></span></div></figure>');
            const sections = parser.parse(dom).sections.toArray();

            sections.should.have.lengthOf(0);
        });
    });

    describe.only('kgGalleryCardToCard', function () {
        // Gallery
        // Mobiledoc {"version":"0.3.1","atoms":[],"cards":[["gallery",{"images":[{ "fileName": "jklm4567.jpeg", "row": 0, "src": "/content/images/2019/06/jklm4567.jpeg", "width": 1200, "height": 800 }, { "fileName": "qurt6789.jpeg", "row": 0, "width": 1200, "height": 800, "src": "/content/images/2019/06/qurt6789.jpeg" }, { "fileName": "zyxw3456.jpeg", "row": 0, "width": 1600, "height": 1066, "src": "/content/images/2019/06/zyxw3456.jpeg" }, { "fileName": "1234abcd.jpeg", "row": 1, "width": 800, "height": 1200, "src": "/content/images/2019/06/1234abcd.jpeg" }]}]], "markups": [], "sections": [[10, 0], [1, "p", []]]}
        // Ghost HTML  <!--kg-card-begin: gallery--><figure class="kg-card kg-gallery-card kg-width-wide"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.5 1 0%;"><img src="http://localhost:2368/content/images/2019/06/jklm4567.jpeg" width="1200" height="800"></div> <div class="kg-gallery-image" style="flex: 1.5 1 0%;"><img src="http://localhost:2368/content/images/2019/06/qurt6789.jpeg" width="1200" height="800"></div></div> <div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.50094 1 0%;"><img src="http://localhost:2368/content/images/2019/06/zyxw3456.jpeg" width="1600" height="1066"></div><div class="kg-gallery-image" style="flex: 0.666667 1 0%;"><img src="http://localhost:2368/content/images/2019/06/1234abcd.jpeg" width="800" height="1200"></div></div></div></figure> <!--kg-card-end: gallery-->

        it('parses kg gallery card html back into a card', function () {
            const dom = buildDOM('<!--kg-card-begin: gallery--><figure class="kg-card kg-gallery-card kg-width-wide"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.5 1 0%;"><img src="http://localhost:2368/content/images/2019/06/jklm4567.jpeg" width="1200" height="800"></div> <div class="kg-gallery-image" style="flex: 1.5 1 0%;"><img src="http://localhost:2368/content/images/2019/06/qurt6789.jpeg" width="1200" height="800"></div></div> <div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.50094 1 0%;"><img src="http://localhost:2368/content/images/2019/06/zyxw3456.jpeg" width="1600" height="1066"></div><div class="kg-gallery-image" style="flex: 0.666667 1 0%;"><img src="http://localhost:2368/content/images/2019/06/1234abcd.jpeg" width="800" height="1200"></div></div></div></figure> <!--kg-card-end: gallery-->');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('gallery');
            section.payload.should.have.property('images');

            section.payload.images.should.be.an.Array().with.lengthOf(4);
            section.payload.images.should.deepEqual([
                {
                    fileName: 'jklm4567.jpeg',
                    row: 0,
                    src: 'http://localhost:2368/content/images/2019/06/jklm4567.jpeg',
                    width: 1200,
                    height: 800
                },
                {
                    fileName: 'qurt6789.jpeg',
                    row: 0,
                    src: 'http://localhost:2368/content/images/2019/06/qurt6789.jpeg',
                    width: 1200,
                    height: 800
                },
                {
                    fileName: 'zyxw3456.jpeg',
                    row: 0,
                    src: 'http://localhost:2368/content/images/2019/06/zyxw3456.jpeg',
                    width: 1600,
                    height: 1066
                },
                {
                    fileName: '1234abcd.jpeg',
                    row: 1,
                    src: 'http://localhost:2368/content/images/2019/06/1234abcd.jpeg',
                    width: 800,
                    height: 1200
                }
            ]);

            should.not.exist(section.payload.caption);
        });

        it('parses kg gallery card with caption', function () {
            const dom = buildDOM('<!--kg-card-begin: gallery--><figure class="kg-card kg-gallery-card kg-width-wide"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.5 1 0%;"><img src="http://localhost:2368/content/images/2019/06/jklm4567.jpeg" width="1200" height="800"></div> <div class="kg-gallery-image" style="flex: 1.5 1 0%;"><img src="http://localhost:2368/content/images/2019/06/qurt6789.jpeg" width="1200" height="800"></div></div> <div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.50094 1 0%;"><img src="http://localhost:2368/content/images/2019/06/zyxw3456.jpeg" width="1600" height="1066"></div><div class="kg-gallery-image" style="flex: 0.666667 1 0%;"><img src="http://localhost:2368/content/images/2019/06/1234abcd.jpeg" width="800" height="1200"></div></div></div><figcaption>My <em>exciting</em> caption</figcaption></figure> <!--kg-card-end: gallery-->');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('gallery');
            section.payload.should.have.property('images');

            section.payload.images.should.be.an.Array().with.lengthOf(4);
            section.payload.images.should.deepEqual([
                {
                    fileName: 'jklm4567.jpeg',
                    row: 0,
                    src: 'http://localhost:2368/content/images/2019/06/jklm4567.jpeg',
                    width: 1200,
                    height: 800
                },
                {
                    fileName: 'qurt6789.jpeg',
                    row: 0,
                    src: 'http://localhost:2368/content/images/2019/06/qurt6789.jpeg',
                    width: 1200,
                    height: 800
                },
                {
                    fileName: 'zyxw3456.jpeg',
                    row: 0,
                    src: 'http://localhost:2368/content/images/2019/06/zyxw3456.jpeg',
                    width: 1600,
                    height: 1066
                },
                {
                    fileName: '1234abcd.jpeg',
                    row: 1,
                    src: 'http://localhost:2368/content/images/2019/06/1234abcd.jpeg',
                    width: 800,
                    height: 1200
                }
            ]);

            section.payload.caption.should.eql('My <em>exciting</em> caption');
        });
    });

    describe('figureIframeToEmbed', function () {
        // YouTube (same structure used for vimeo, instagram, etc)
        // Mobiledoc {"version":"0.3.1","atoms":[],"cards":[["embed",{"url":"https://www.youtube.com/watch?v=YTVID","html":"<iframe width=\"480\" height=\"270\" src=\"https://www.youtube.com/embed/YTVID?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>","type":"video"}]],"markups":[],"sections":[[10,0],[1,"p",[]]]}
        // Ghost HTML <!--kg-card-begin: embed--><figure class="kg-card kg-embed-card"><iframe width="480" height="270" src="https://www.youtube.com/embed/YTVID?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></figure><!--kg-card-end: embed-->
        // Medium Export HTML <figure name="abc" id="abc" class="graf graf--figure graf--iframe graf-after--p"><iframe src="https://www.youtube.com/embed/YTVID?feature=oembed" width="700" height="393" frameborder="0" scrolling="no"></iframe></figure>
        // Medium Live HTML <figure><iframe data-width="854" data-height="480" width="700" height="393" data-src="/media/345?postId=567" data-media-id="345" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FYTVID%2Fhqdefault.jpg&amp;key=abc" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="/media/345?postId=567"></iframe></figure>

        it('parses youtube iframe into embed card', function () {
            const dom = buildDOM('<figure class="kg-card kg-embed-card"><iframe width="480" height="270" src="https://www.youtube.com/embed/YTVID?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('embed');
            section.payload.should.deepEqual({
                url: 'https://www.youtube.com/embed/YTVID?feature=oembed',
                html: '<iframe width="480" height="270" src="https://www.youtube.com/embed/YTVID?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>'
            });
        });

        it('parses medium youtube iframe into embed card', function () {
            const dom = buildDOM('<figure name="abc" id="abc" class="graf graf--figure graf--iframe graf-after--p"><iframe src="https://www.youtube.com/embed/YTVID?feature=oembed" width="700" height="393" frameborder="0" scrolling="no"></iframe></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('embed');
            section.payload.should.deepEqual({
                url: 'https://www.youtube.com/embed/YTVID?feature=oembed',
                html: '<iframe src="https://www.youtube.com/embed/YTVID?feature=oembed" width="700" height="393" frameborder="0" scrolling="no"></iframe>'
            });
        });

        it('parses youtube iframe with caption into embed card', function () {
            const dom = buildDOM('<figure class="kg-card kg-embed-card"><iframe width="480" height="270" src="https://www.youtube.com/embed/YTVID?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><figcaption>My Video</figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('embed');
            section.payload.should.deepEqual({
                url: 'https://www.youtube.com/embed/YTVID?feature=oembed',
                html: '<iframe width="480" height="270" src="https://www.youtube.com/embed/YTVID?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
                caption: 'My Video'
            });
        });

        it('ignores iframe with relative src', function () {
            const dom = buildDOM('<figure><iframe data-width="854" data-height="480" width="700" height="393" data-src="/media/345?postId=567" data-media-id="345" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FYTVID%2Fhqdefault.jpg&amp;key=abc" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="/media/345?postId=567"></iframe></figure>');
            const sections = parser.parse(dom).sections.toArray();

            sections.should.have.lengthOf(0);
        });
    });

    describe('figureBlockquoteToEmbed', function () {
        // Twitter
        // Mobiledoc {"version":"0.3.1","atoms":[],"cards":[["embed",{"url":"https://twitter.com/iamdevloper/status/1133348012439220226","html":"<blockquote class=\"twitter-tweet\"><p lang=\"en\" dir=\"ltr\">I see &quot;blockchain engineer&quot;, I hear &quot;fancy spreadsheet admin&quot;.</p>&mdash; I Am Devloper (@iamdevloper) <a href=\"https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw\">May 28, 2019</a></blockquote>\n<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n","type":"rich"}]],"markups":[],"sections":[[10,0],[1,"p",[]]]}
        // Ghost HTML <!--kg-card-begin: embed--><figure class="kg-card kg-embed-card"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">I see &quot;blockchain engineer&quot;, I hear &quot;fancy spreadsheet admin&quot;.</p>&mdash; I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw">May 28, 2019</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></figure><!--kg-card-end: embed-->
        // Medium Export HTML <figure name="7b98" id="7b98" class="graf graf--figure graf--iframe graf-after--p graf--trailing"><blockquote class="twitter-tweet"><a href="https://twitter.com/iamdevloper/status/1133348012439220226"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></figure>
        // Medium Live HTML <figure name="7b98" id="7b98" class="graf graf--figure graf--iframe graf-after--p graf--trailing"><iframe data-width="500" data-height="281" width="500" height="281" data-src="/media/6969?postId=890" data-media-id="6969" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1071055431215276033%2FU9-RIlDs_400x400.jpg&amp;key=abc" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="/media/6969?postId=890"></iframe></figure>

        it('parses twitter blockquote into embed card', function () {
            const dom = buildDOM('<figure class="kg-card kg-embed-card"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">I see &quot;blockchain engineer&quot;, I hear &quot;fancy spreadsheet admin&quot;.</p>&mdash; I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw">May 28, 2019</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('embed');
            section.payload.should.deepEqual({
                url: 'https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw',
                html: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I see "blockchain engineer", I hear "fancy spreadsheet admin".</p>— I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw">May 28, 2019</a></blockquote><script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
            });
        });

        it('parses medium twitter blockquote into embed card', function () {
            const dom = buildDOM('<figure name="7b98" id="7b98" class="graf graf--figure graf--iframe graf-after--p graf--trailing"><blockquote class="twitter-tweet"><a href="https://twitter.com/iamdevloper/status/1133348012439220226"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('embed');
            section.payload.should.deepEqual({
                url: 'https://twitter.com/iamdevloper/status/1133348012439220226',
                html: '<blockquote class="twitter-tweet"><a href="https://twitter.com/iamdevloper/status/1133348012439220226"></a></blockquote><script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
            });
        });

        it('parses twitter blockquote with caption into embed card', function () {
            const dom = buildDOM('<figure class="kg-card kg-embed-card"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">I see &quot;blockchain engineer&quot;, I hear &quot;fancy spreadsheet admin&quot;.</p>&mdash; I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw">May 28, 2019</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script><figcaption>A Tweet</figcaption></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('embed');
            section.payload.should.deepEqual({
                url: 'https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw',
                html: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I see "blockchain engineer", I hear "fancy spreadsheet admin".</p>— I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw">May 28, 2019</a></blockquote><script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
                caption: 'A Tweet'
            });
        });

        it('parses twitter blockquote with linked caption into embed card', function () {
            const dom = buildDOM('<figure class="kg-card kg-embed-card"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">I see &quot;blockchain engineer&quot;, I hear &quot;fancy spreadsheet admin&quot;.</p>&mdash; I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw">May 28, 2019</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script><figcaption><a href="https://twitter.com">A Tweet</a></figcaption></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('embed');
            section.payload.should.deepEqual({
                url: 'https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw',
                html: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I see "blockchain engineer", I hear "fancy spreadsheet admin".</p>— I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1133348012439220226?ref_src=twsrc%5Etfw">May 28, 2019</a></blockquote><script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
                caption: '<a href="https://twitter.com">A Tweet</a>'
            });
        });
    });

    describe('preCodeToCard', function () {
        it('parses PRE>CODE into code card', function () {
            const dom = buildDOM('<figure><pre><code>Test code</code></pre></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('code');
            section.payload.should.deepEqual({
                code: 'Test code'
            });
        });

        it('extracts language from pre class name', function () {
            const dom = buildDOM('<figure><pre class="language-javascript"><code>Test code</code></pre></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('code');
            section.payload.should.deepEqual({
                code: 'Test code',
                language: 'javascript'
            });
        });

        it('extracts language from code class name', function () {
            const dom = buildDOM('<figure><pre><code class="language-ruby">Test code</code></pre></figure>');
            const [section] = parser.parse(dom).sections.toArray();

            section.type.should.equal('card-section');
            section.name.should.equal('code');
            section.payload.should.deepEqual({
                code: 'Test code',
                language: 'ruby'
            });
        });
    });
});
