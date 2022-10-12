import React from 'react';
import {KoenigComposer, KoenigEditor} from '../src';
import FloatingButton from './components/FloatingButton';
import SerializedStateTextarea from './components/SerializedStateTextarea';
import {useState} from 'react';
import Watermark from './components/Watermark';

function DemoApp() {
    const [sidebarState, setSidebarState] = useState(false);
    function openSidebar() {
        setSidebarState(!sidebarState);
    }

    async function imageUploader(event) {
        event.preventDefault();
        function convertToURL(file) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    resolve(fileReader.result);
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
            });
        }
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            const url = await convertToURL(file);
            return {
                src: url
            };
        }
    }

    return (
        <div className="koenig-lexical top">
            <KoenigComposer>
                <Watermark />
                <div className="h-full grow overflow-auto">
                    <div className="mx-auto h-full max-w-2xl pt-[15vmin]">
                        <KoenigEditor
                            imageUploadFunc={imageUploader}
                        />
                    </div>
                </div>
                <div className="flex h-full flex-col items-end">
                    <SerializedStateTextarea toggle={sidebarState} />
                    <FloatingButton onClick={openSidebar} />
                </div>
            </KoenigComposer>
        </div>
    );
}

export default DemoApp;
