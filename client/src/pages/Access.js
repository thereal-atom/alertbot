import React from 'react';
import './Styles/Access.css';

const Access = ({currentUser}) => {
    return (
        <div className="access-container">   
            {window.localStorage.getItem("token") === null ? <div className="access-wrapper">
                <img src="https://cdn.discordapp.com/attachments/810932922306789406/881838639053697054/Screenshot_55.png" alt="alertbot" />
                <h1>AlertBot</h1>
                <p>AlertBot is currently reserved for alpha testers. Sign in below to confirm that you are an alpha tester. If you think you should be one contact me on discord at Atomツ#6969</p>
                <div>
                    <button className="access-signin" onClick={() => window.location.href = (`${process.env.REACT_APP_API_URL}/discord/login`)}><i class='bx bxl-discord' ></i> Sign In</button>
                    <button className="access-contact">Contact</button>
                </div>
            </div> : <div className="no-access-wrapper">
                <img src="https://cdn.discordapp.com/attachments/810932922306789406/881838639053697054/Screenshot_55.png" alt="alertbot" />
                <h1>You are not a beta tester</h1>
                <h2>{currentUser.username}#{currentUser.discriminator}</h2>
                <p>AlertBot is currently reserved for alpha testers. Sign in below to confirm that you are an alpha tester. If you think you should be one contact me on discord at Atomツ#6969</p>
            </div>
            }
        </div>
    )
}

export default Access
