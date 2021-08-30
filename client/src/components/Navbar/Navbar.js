import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="navbar-contianer">
            <nav className="navbar">
                <p>Logo</p>
                <p className="middle">Home</p>
                <button>Login</button>
            </nav>
            <div className="wrapper">
                <div className="inputs-container">
                    <div className="inputs-wrapper">
                        <input className="type-input" placeholder="Ticker" type="text" />
                        <input className="type-input" placeholder="Entry" type="text" />
                        <input className="type-input" placeholder="Target" type="text" />
                        <input className="type-input" placeholder="Stop loss" type="text" />
                        <input className="type-input" placeholder="Note" type="text" />
                    </div>
                </div>
                <div className="output-container">
                    Output
                </div>
                <div className="servers-container">
                    Servers
                </div>
            </div>
        </div>
    )
}

export default Navbar
