import '../utils/index.js';
import atom from '../../src/atoms/soft-return.js';
import {Document as SimpleDomDocument, HTMLSerializer, voidMap} from 'simple-dom';

const serializer = new HTMLSerializer(voidMap);

describe('Soft return atom', function () {
    it('generates a `br` tag', function () {
        const opts = {
            env: {
                dom: new SimpleDomDocument()
            }
        };

        serializer.serialize(atom.render(opts)).should.match('<br>');
    });
});
