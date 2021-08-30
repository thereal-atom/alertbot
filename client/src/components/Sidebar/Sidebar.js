import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import axios from 'axios';

const Sidebar = ({currentUser, subscriptionUser}) => {
    const [active, setActive] = useState(false);
    const [newPreset, setPreset] = useState();
    const [loading, setLoading] = useState();
    const [allPresets, setPresets] = useState();
    const [loggedIn, setLoggedIn] = useState({
        discord: false
    });
    const [modal, setModal] = useState(false);

    const handleClick = () => {
        console.log('Click')
        setActive(!active);
    }
    const handlePresetChange = (e) => {
        setPreset(e.target.value);
    }
    const getPresets = async () => {
        if(window.localStorage.getItem('token')){
            setLoggedIn({
                discord: true
            });
        }else{
            setLoggedIn({
                discord: false
            });
        }
        if(currentUser){
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/presets/all?email=${currentUser.email}`);
            setPresets(data);
        }
    } 
    const submitPreset = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/presets/new?email=${currentUser.email}`, {
                presetName: newPreset,
            })
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }
    const handleLogout = async () => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/discord/logout?token=${window.localStorage.getItem("token")}`);
        window.localStorage.removeItem('token');
        window.location.href = `${process.env.REACT_APP_HOME_URL}/`
    }
    const handleSubscription = e => {
        e.preventDefault();
        setModal(true)
    }
    const handleClose = (e) => {
        if(e.target.className === "sidebar-modal active"){
            setModal(false)
        }
    }
    useEffect(() => {
        getPresets();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, currentUser])
    return (
        window.location.pathname !== "/" && window.location.pathname !== "/privacy" && window.location.pathname !== "/cookie" && window.location.pathname !== "/terms" ? <>
            <div className={`sidebar-modal${modal?' active':''}`} onClick={handleClose}>
                <div className="sidebar-modal-box">
                    <i class='bx bxs-crown'></i>
                    <h1>Join Premium</h1>
                    <p>Upgrade to AlertBot Premium (from $8/month) to unlock this feature</p>
                    <a href="/premium">Upgrade</a>
                </div>
            </div>
            <div className="sidebar-container" style={{visibility: `${window.location.pathname === '/' ? 'hidden' : 'visible'}`}}>
                <p className="logo"><i className='bx bxs-bell'></i> Alert Bot</p>
                <div className="nav__items-container"> 
                    <a href="/" className="nav-item"><i className='bx bx-home-alt'></i> Home</a>
                    <a href={window.localStorage.getItem('token') ? "/account" : `${process.env.REACT_APP_API_URL}/discord/login`} className="nav-item"><i className='bx bx-user' ></i> Account</a>
                    {loggedIn.discord === true ? <a href={allPresets ? `/alert?name=${allPresets ? allPresets[0] ? allPresets[0].name : 'entry' : ''}` : ''} className="nav-item"><i className='bx bx-bell'></i> Alert</a> : <a href={`${process.env.REACT_APP_API_URL}/discord/login`} className="nav-item"><i className='bx bx-bell'></i> Alert</a>}
                    <a href={process.env.REACT_APP_INVITE} className="nav-item"><i className='bx bx-group' ></i> Invite</a>
                    <a href="/premium" className="nav-item" id="premium"><i className='bx bxs-diamond' ></i> Premium</a>
                    <button className="nav-item" id="presets-nav" onClick={handleClick}><i className='bx bx-spreadsheet'></i> Presets<i className='bx bxs-down-arrow-alt' id="arrow"></i></button>
                    <div className={`dropdown-container${active?' active':''}`}>
                        <div className="add-preset-sidebar">
                            {subscriptionUser ? <> <i class='bx bx-plus-circle' onClick={(e) => {subscriptionUser.level === "premium" ? submitPreset() : handleSubscription(e)}}></i><input type="text" placeholder="Enter new preset name" onChange={handlePresetChange} onClick={(e) => {subscriptionUser.level === "premium" ? submitPreset() : handleSubscription(e)}}/> </> : <> <i class='bx bx-plus-circle' onClick={e => handleSubscription(e)}></i><input type="text" placeholder="Enter new preset name" onChange={handlePresetChange} onClick={e => handleSubscription(e)}/> </>}
                        </div>
                        {
                            loggedIn.discord === true && allPresets ? subscriptionUser.level === "premium" ? 
                                allPresets.map(preset => (
                                    <a href={`/presets?name=${preset.name}`} className="nav-item" id="capitalize"><i className='bx bx-checkbox-minus' ></i> {preset.name}</a>   
                                )) 
                            : <a href="/presets?name=entry" className="nav-item" id="capitalize"><i className='bx bx-checkbox-minus' ></i> Entry</a>   
                            : ''
                        }
                    </div>
                </div>
                <div className="sidebar-account-container" >
                    <div className={`login-container${loggedIn.discord===true?'':' active'}`} style={{visibility: `${window.location.pathname === '/' ? 'hidden' : ''}`}}>
                        <a href={`${process.env.REACT_APP_API_URL}/discord/login`}><i class='bx bxl-discord'></i> Login with discord</a>
                    </div>
                    <div className={`logout-container${loggedIn.discord===true?' active':''}`} href="/account" style={{visibility: `${window.location.pathname === '/' ? 'hidden' : ''}`}}>
                        <img src={`https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.webp`} alt="avatar" />
                        <a className="sidebar-username" href="/account">{currentUser.username}#{currentUser.discriminator}</a>
                        <i class='bx bx-log-out' onClick={handleLogout}></i>
                    </div>
                </div>
            </div>
        </> : (window.location.pathname === "/privacy" || window.location.pathname === "/cookie" || window.location.pathname === "/terms") && !window.localStorage.getItem('token') ? 
        <div className="sidebar-container" style={{visibility: `${window.location.pathname === '/' ? 'hidden' : 'visible'}`}}>
            <p className="logo"><i className='bx bxs-bell'></i> Alert Bot</p>
            <div className="nav__items-container"> 
                <a href="/" className="nav-item"><i className='bx bx-home-alt'></i> Home</a>
                <a href={`${process.env.REACT_APP_API_URL}/discord/login`} className="nav-item"><i className='bx bx-user' ></i> Account</a>
                <a href={`${process.env.REACT_APP_API_URL}/discord/login`} className="nav-item"><i className='bx bx-bell'></i> Alert</a>
                <a href={process.env.REACT_APP_INVITE} className="nav-item"><i className='bx bx-group' ></i> Invite</a>
                <a href="/premium" className="nav-item" id="premium"><i className='bx bxs-diamond' ></i> Premium</a>
                <button className="nav-item" id="presets-nav" onClick={() => window.location.href=`${process.env.REACT_APP_API_URL}/discord/login`}><i className='bx bx-spreadsheet'></i> Presets<i className='bx bxs-down-arrow-alt' id="arrow"></i></button>
            </div>
            <div className="sidebar-account-container" >
                <div className={`login-container active`}>
                    <a href={`${process.env.REACT_APP_API_URL}/discord/login`}><i class='bx bxl-discord'></i> Login with discord</a>
                </div>
            </div>
        </div> : ''
    )
}

export default Sidebar
