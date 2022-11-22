const {shouldRender} = require('./utils');

describe('Images', function () {
    it('should render', shouldRender({
        input: `{
            "root": {
              "children": [
                {
                  "altText": "This is Alt",
                  "caption": "This is a caption",
                  "src": "https://example.com/image.png",
                  "type": "image",
                  "cardWidth": "regular"
                }
              ],
              "direction": null,
              "format": "",
              "indent": 0,
              "type": "root",
              "version": 1
            }
          }`,
        options: `{
            target: 'html'
        }`,
        output: `
        <figure class="kg-card kg-image-card">
            <img src="https://example.com/image.png" alt="This is Alt" loading="lazy" />
                <figcaption>
                This is a caption
                </figcaption>
        </figure>
        `
    }));
    it('should render wide image', shouldRender({
        input: `{
            "root": {
              "children": [
                {
                  "altText": "This is Alt",
                  "caption": "This is a caption",
                  "src": "https://example.com/image.png",
                  "type": "image",
                  "cardWidth": "wide"
                }
              ],
              "direction": null,
              "format": "",
              "indent": 0,
              "type": "root",
              "version": 1
            }
          }`,
        output: `
        <figure class="kg-card kg-image-card kg-width-wide">
            <img src="https://example.com/image.png" alt="This is Alt" loading="lazy" />
                <figcaption>
                This is a caption
                </figcaption>
        </figure>
        `
    }));

    it('should render full image', shouldRender({
        input: `{
          "root": {
            "children": [
              {
                "altText": "This is Alt",
                "caption": "This is a caption",
                "src": "https://example.com/image.png",
                "type": "image",
                "cardWidth": "full"
              }
            ],
            "direction": null,
            "format": "",
            "indent": 0,
            "type": "root",
            "version": 1
          }
        }`,
        output: `
        <figure class="kg-card kg-image-card kg-width-full">
            <img src="https://example.com/image.png" alt="This is Alt" loading="lazy" />
                <figcaption>
                This is a caption
                </figcaption>
        </figure>
        `
    }));

    it('should render image dimensions', shouldRender({
        input: `{
        "root": {
          "children": [
            {
              "altText": "This is Alt",
              "caption": "This is a caption",
              "src": "/content/images/2022/11/koenig-lexical.jpg",
              "type": "image",
              "cardWidth": "full",
              "width": 100,
              "height": 100
            }
          ],
          "direction": null,
          "format": "",
          "indent": 0,
          "type": "root",
          "version": 1
        }
      }`,
        output: `
        <figure class="kg-card kg-image-card kg-width-full">
            <img src="/content/images/2022/11/koenig-lexical.jpg" alt="This is Alt" loading="lazy" width="100" height="100" />
                <figcaption>
                This is a caption
                </figcaption>
        </figure>
        `
    }));

    it('should render image with srcset', shouldRender({
        input: `{
      "root": {
        "children": [
          {
            "altText": "This is Alt",
            "caption": "This is a caption",
            "src": "/content/images/2022/11/koenig-lexical.jpg",
            "type": "image",
            "cardWidth": "full",
            "width": 3000,
            "height": 6000
          }
        ],
        "direction": null,
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
      }
    }`,
        options: {
            imageOptimization: {
                contentImageSizes: {
                    w600: {width: 600},
                    w1000: {width: 1000},
                    w1600: {width: 1600},
                    w2400: {width: 2400}
                }
            }
        },
        output: `
        <figure class="kg-card kg-image-card kg-width-full">
            <img src="/content/images/2022/11/koenig-lexical.jpg" alt="This is Alt" loading="lazy" width="3000" height="6000" srcset="/content/images/size/w600/2022/11/koenig-lexical.jpg 600w, /content/images/size/w1000/2022/11/koenig-lexical.jpg 1000w, /content/images/size/w1600/2022/11/koenig-lexical.jpg 1600w, /content/images/size/w2400/2022/11/koenig-lexical.jpg 2400w" />
                <figcaption>
                This is a caption
                </figcaption>
        </figure>
        `
    }));

    it('should use resized width and height when theres max width', shouldRender({
        input: `{
      "root": {
        "children": [
          {
            "altText": "This is Alt",
            "caption": "This is a caption",
            "src": "/content/images/2022/11/koenig-lexical.jpg",
            "type": "image",
            "cardWidth": "full",
            "width": 3000,
            "height": 6000
          }
        ],
        "direction": null,
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
      }
    }`,
        options: {
            imageOptimization: {
                defaultMaxWidth: 2000
            },
            canTransformImage: () => true
        },
        output: `
        <figure class="kg-card kg-image-card kg-width-full">
            <img src="/content/images/2022/11/koenig-lexical.jpg" alt="This is Alt" loading="lazy" width="2000" height="4000" />
                <figcaption>
                This is a caption
                </figcaption>
        </figure>
        `
    }));

    it('is included when src is an unsplash image', shouldRender({
        input: `{
    "root": {
      "children": [
        {
          "altText": "This is Alt",
          "caption": "This is a caption",
          "src": "https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ",
          "type": "image",
          "cardWidth": "full",
          "width": 3000,
          "height": 6000
        }
      ],
      "direction": null,
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1
    }
  }`,
        options: {
            imageOptimization: {
                contentImageSizes: {
                    w600: {width: 600},
                    w1000: {width: 1000},
                    w1600: {width: 1600},
                    w2400: {width: 2400}
                }
            }
        },
        output: `
        <figure class="kg-card kg-image-card kg-width-full">
            <img src="https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ" alt="This is Alt" loading="lazy" width="3000" height="6000" srcset="https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ 600w, https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ 1000w, https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1600&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ 1600w, https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2400&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ 2400w" />
                <figcaption>
                This is a caption
                </figcaption>
        </figure>
        `
    }));
});
