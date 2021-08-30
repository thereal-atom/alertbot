import './Loading.css';
import React from 'react';
import animation from '../spinner.svg'

const Loading = () => {
    return(
        <div className="loading-conatiner">
            <img src={animation} alt="" />
        </div>
    );
};

export default Loading;