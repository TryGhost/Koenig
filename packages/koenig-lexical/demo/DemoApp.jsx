import {KoenigComposer, KoenigEditor} from '../src';
import SerializedStateTextarea from './components/SerializedStateTextarea';

function DemoApp() {
    return (
        <div className="koenig-lexical demo-container">
            <KoenigComposer>
                <div className="demo-editor">
                    <KoenigEditor>
                    </KoenigEditor>
                </div>
                <SerializedStateTextarea />
            </KoenigComposer>
        </div>
    );
}

export default DemoApp;
