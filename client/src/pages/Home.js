import React from 'react';
import './Styles/Home.css'

const Home = () => {
    return (
    <div className="home-wrapper">
        <div className="border-top-container">s</div>   
        <div className="home-container">
            <div className="home__container">
                <div className="hero-container">
                    <div className="nav-container">
                        <h1>AlertBot</h1>
                        <ul>
                            <li><a href="https://oscarfal2006.gitbook.io/alert-bot/">Documentation</a></li>
                            <li><a href={window.localStorage.getItem('token') ? `/account` : `${process.env.REACT_APP_API_URL}/discord/login`}>Dashboard</a></li>
                            <li><a href="/premium">Premium</a></li>
                        </ul>
                    </div>
                    <div className="hero-wrapper">
                        <img src="https://cdn.discordapp.com/avatars/871038939560050739/6a241f6bcdef12b59de45b50ccdd5a83.webp" alt="avatar" />
                        <h1>AlertBot</h1>
                        <p>Alerting made easy</p>
                        <div className="buttons-wrapper">
                            <a className="invite" href="https://discord.com/oauth2/authorize?client_id=871038939560050739&scope=bot&permissions=8">Invite Me</a>
                            <a className="dashboard" href={window.localStorage.getItem('token') ? `/account` : `${process.env.REACT_APP_API_URL}/discord/login`}>Dashboard</a>
                        </div>

                    </div>
                </div>
                <div className="features-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200"><path fill="var(--background)" fill-opacity="1" d="M0,96L40,112C80,128,160,160,240,144C320,128,400,64,480,48C560,32,640,64,720,69.3C800,75,880,53,960,58.7C1040,64,1120,96,1200,96C1280,96,1360,64,1400,48L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path></svg>
                    <div className="features-wrapper">
                        <h1>Features</h1>
                        <div className="features__container">
                            <div className="sending-container">
                                {/* <i className='bx bx-mail-send'></i> */}
                                <i className='bx bxs-send' ></i>
                                <h1>Send</h1>
                                <p>Send alerts and add to servers from one screen</p>
                            </div>
                            <div className="presets-container">
                                {/* <i className='bx bx-spreadsheet' ></i> */}
                                <i className='bx bxs-spreadsheet' ></i>
                                <h1>Presets</h1>
                                <p>Create presets and templates for seemless alerting</p>
                            </div>
                            <div className="customize-container">
                                {/* <i className='bx bx-customize' ></i> */}
                                <i className='bx bxs-customize' ></i>
                                <h1>Cusomize</h1>
                                <p>Customize your bot avatar, nickname and presence</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="stats-container">
                <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100" ><path fill="var(--background)" fill-opacity="1" d="M-41.53,-9.56 C167.83,173.98 302.14,-60.89 534.09,89.10 L500.00,0.00 L0.00,0.00 Z"></path></svg>
                <div className="numbers-container">
                    <div className="users-container">
                        <h1 className="stats-text">Alerting to</h1>
                        <h1 className="number">68,000+</h1>
                        <h1 className="stats-text">Total users</h1>
                    </div>
                    <div className="servers-container">
                        <h1 className="stats-text">Sent Over</h1>
                        <h1 className="number">650+</h1>
                        <h1 className="stats-text">Alerts</h1>
                    </div>
                </div>
                <h1 className="alerters-title">Top alerters using AlertBot</h1>
                <div className="top-alerters-container">
                    <div className="alerter">
                        <img src="https://cdn.discordapp.com/avatars/825861822028054598/6b70dfbfdc207c5603cef36902208765.webp" alt="avatar" />
                    </div>
                    <div className="alerter">
                        <img src="https://cdn.discordapp.com/avatars/815350592108101672/f0593ea0a07ff402eca9c6e2f1db0226.webp" alt="avatar" />
                    </div>
                    <div className="alerter">
                        <img src="https://cdn.discordapp.com/avatars/822914367896158258/741c668764e41d2cc9c73228e3def691.webp" alt="avatar" />
                    </div>
                </div>
            </div>
            <div className="footer__container">
                <div className="footer__links">
                    <div className="footer__link--wrapper">
                        <div className="footer__link--items">
                            <h2>About Us</h2>
                            <a href="/privacy">Privacy Policy</a> 
                            <a href="/cookie">Cookie Policy</a>
                            <a href="/terms">Terms of Service</a>
                        </div>
                        <div className="footer__link--items">
                            <h2>Support</h2>
                            <a href="mailto:alertbotdev@gmail.com">Feedback</a> 
                            <a href="mailto:alertbotxyz@gmail.com">Email</a>
                            <a href="https://discordapp.com/users/313202630023315487">Discord</a>
                            <a href={process.env.REACT_APP_DOCS_URL}>Documentation</a>
                        </div>
                    </div>
                    <div className="footer__link--wrapper">
                        <div className="footer__link--items">
                            <h2>Bot</h2>
                            <a href="https://discord.com/oauth2/authorize?client_id=871038939560050739&scope=bot&permissions=8">Invite</a>
                            <a href="/premium">Premium</a>
                            <a href="/account">Account</a>
                        </div>
                        <div className="footer__link--items">
                            <h2>Other</h2>
                            <a href="/support">Support</a> 
                            <a href="/review">Reviews</a>
                            <a href="/changelog">Changelog</a>
                        </div>
                    </div>
                </div>
                <section className="social__media">
                    <div className="social__media--wrap">
                        <div className="footer__logo">
                            <a href="/" id="footer__logo">AlertBot</a>
                        </div>
                        <p className="website__rights">© AlertBot 2021. All rights reserved</p>
                        {/* <div className="social__icons">
                            <a href="https://github.com/thereal-atom/alertbot" className="social__icon--link" ><i className="fab fa-github"></i></a>
                            <a href="https://discord.gg/ZEb4nT32" className="social__icon--link" ><i className="fab fa-discord"></i ></a>
                            <a href="https://twitter.com/thereal_atom" className="social__icon--link" ><i className="fab fa-twitter"></i></a>
                        </div> */}
                        <p className="website__rights">Alpha v1.0.1</p>
                    </div>
                </section>
            </div>
        </div>
    </div>
    )
}

export default Home
