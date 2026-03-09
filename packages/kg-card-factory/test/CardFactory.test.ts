/* eslint-disable @typescript-eslint/no-explicit-any */
import './utils/index.js';
import CardFactory from '../src/CardFactory.js';
import {Document as SimpleDomDocument, HTMLSerializer, voidMap} from 'simple-dom';

const serializer = new HTMLSerializer(voidMap);

describe('CardFactory', function () {
    describe('render', function () {
        it('adds comment wrapper when configured', function () {
            const cardDefinition = {
                name: 'test',
                type: 'dom',
                config: {commentWrapper: true},
                render({env: {dom}}: any) {
                    const div = dom.createElement('div');
                    div.appendChild(dom.createTextNode('Test!'));
                    return div;
                }
            };
            const factory = new CardFactory();
            const card = factory.createCard(cardDefinition);

            const opts = {env: {dom: new SimpleDomDocument()}, payload: undefined, options: {}};

            serializer.serialize(card.render(opts))
                .should.eql('<!--kg-card-begin: test--><div>Test!</div><!--kg-card-end: test-->');
        });

        it('skips comment wrapper if card output is blank', function () {
            const cardDefinition = {
                name: 'test',
                type: 'dom',
                config: {commentWrapper: true},
                render({env: {dom}}: any) {
                    return dom.createTextNode('');
                }
            };
            const factory = new CardFactory();
            const card = factory.createCard(cardDefinition);

            const opts = {env: {dom: new SimpleDomDocument()}, payload: undefined, options: {}};

            serializer.serialize(card.render(opts)).should.eql('');
        });
    });

    describe('absoluteToRelative', function () {
        it('passes siteUrl in from factory options', function () {
            const cardDefinition = {
                name: 'test',
                type: 'dom',
                render() {
                    return {};
                },
                absoluteToRelative(_payload: any, options: any) {
                    return options.siteUrl;
                }
            };
            const factory = new CardFactory({siteUrl: 'http://127.0.0.1:2368/'});
            const card = factory.createCard(cardDefinition);

            card.absoluteToRelative(undefined).should.equal('http://127.0.0.1:2368/');
        });
    });

    describe('relativeToAbsolute', function () {
        it('passes siteUrl in from factory options', function () {
            const cardDefinition = {
                name: 'test',
                type: 'dom',
                render() {
                    return {};
                },
                relativeToAbsolute(_payload: any, options: any) {
                    return options.siteUrl;
                }
            };
            const factory = new CardFactory({siteUrl: 'http://127.0.0.1:2368/'});
            const card = factory.createCard(cardDefinition);

            card.relativeToAbsolute(undefined).should.equal('http://127.0.0.1:2368/');
        });
    });
});
/* eslint-enable @typescript-eslint/no-explicit-any */
