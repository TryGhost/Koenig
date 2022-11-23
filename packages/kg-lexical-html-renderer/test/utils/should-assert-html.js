const Renderer = require('../..');
const Prettier = require('prettier');

const shouldAssertHtml = function ({input, output, options}) {
    return function () {
        const renderer = new Renderer();
        const formattedOutput = Prettier.format(output, {parser: 'html'});
        const rendered = renderer.render(input, options);
        rendered.should.equal(formattedOutput);
    };
};

module.exports = {shouldAssertHtml};
