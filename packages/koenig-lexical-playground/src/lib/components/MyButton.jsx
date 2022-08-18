import React from 'react';

const MyButton = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div className="card">
            <button onClick={() => setCount(count => count + 1)}>
                count is {count}
            </button>
        </div>
    );
};

export default MyButton;
