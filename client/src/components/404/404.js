import React from 'react';
import './404.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>Page Not Found</p>
            <a href="/">Go Back Home</a>
        </div>
    );
};

export default NotFound;
