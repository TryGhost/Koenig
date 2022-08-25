import {KoenigComposer, KoenigEditor} from '../lib';
import TreeViewPlugin from './TreeViewPlugin';
import Preview from './preview';

function DemoApp() {
    return (
        <KoenigComposer>
            <div className="demo-container">
                <div className="demo-editor">
                    <KoenigEditor autoFocus={true}>
                    </KoenigEditor>
                </div>
                <div className="demo-tree">
                    <TreeViewPlugin />
                </div>
            </div>
            <Preview />
        </KoenigComposer>
    );
}

export default DemoApp;
