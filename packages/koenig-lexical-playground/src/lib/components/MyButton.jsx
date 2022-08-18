import React from 'react';
import '../index.css';

const MyButton = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div className="flex h-screen">
            <div className="m-auto">
                <div className="text-center text-6xl text-red-600">{count}</div>
                <button className="rounded bg-green-800 px-6 py-2 text-white hover:bg-green-600" type="button" onClick={() => setCount(count => count + 1)}>
                    count+
                </button>
            </div>
        </div>
    );
};

export default MyButton;
