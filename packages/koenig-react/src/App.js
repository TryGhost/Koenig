import * as React from 'react';
import {Editor, Container, Toolbar} from 'react-mobiledoc-editor';

function App() {
    return (
        <>
            <h1 className='text-center'>The Editor</h1>
            <Container>
                <Toolbar className="flex" />
                <Editor/>
            </Container>
        </>
    );
}

export default App;
