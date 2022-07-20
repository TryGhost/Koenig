import * as React from 'react';
import {Editor, Container, Toolbar} from 'react-mobiledoc-editor';

function App() {
    return (
        <>
            <Container>
                <Toolbar className="flex" />
                <Editor/>
            </Container>
        </>
    );
}

export default App;
