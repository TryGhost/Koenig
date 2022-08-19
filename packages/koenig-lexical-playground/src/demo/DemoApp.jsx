import {KoenigComposer, KoenigEditor} from '../lib';
import TreeViewPlugin from './TreeViewPlugin';

function DemoApp() {
    return (
        <div className="demo-container">
            <KoenigComposer>
                <div className="demo-editor">
                    <KoenigEditor autoFocus={true}>
                    </KoenigEditor>
                </div>
                <div className="demo-tree">
                    <TreeViewPlugin />
                </div>
            </KoenigComposer>
        </div>
    );
}

export default DemoApp;
