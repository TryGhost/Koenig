import {LexicalComposer} from '@lexical/react/LexicalComposer';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
    console.error(error); // eslint-disable-line
}

const initialConfig = {
    namespace: 'KoenigEditor',
    onError
};

const KoenigComposer = ({children}) => {
    return (
        <LexicalComposer initialConfig={initialConfig}>
            {children}
        </LexicalComposer>
    );
};

export default KoenigComposer;
