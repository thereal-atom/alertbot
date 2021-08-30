import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Styles/Account.css';
import { format } from 'date-fns'; 
import AccountLoading from '../components/Loading/Pages/Account/Account';

const Account = ({currentUser, subscriptionUser}) => {
    const [payments, setPayments] = useState();
    const [subscription, setSubscription] = useState();
    const [loading, setLoading] = useState();
    const [bot, setBot] = useState();
    const [alert, setAlert] = useState('hide');
    const [errorText, setErrorText] = useState();
    const [newImage, setImage] = useState();
    const [botName, setBotName] = useState();
    const [botToken, setBotToken] = useState();
    const [modal, setModal] = useState(false);

    const getBase64 = (file) => {
        setLoading(true);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }
    const handleSubscription = e => {
        e.preventDefault();
        if(subscriptionUser.level !== "premium"){
            setModal(true)
            setBotName();
            setBotToken();
        }
    }
    const handleClose = (e) => {
        if(e.target.className === "sidebar-modal active"){
            setModal(false)
        }
    }

    const fileSelectedHandler = e => {
        if(subscriptionUser.level !== "premium") return handleSubscription(e)
        if(bot.id !== "871038939560050739"){
            try{
                getBase64(e.target.files[0]).then(async fileData => 
                    {   
                        const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/discord/update/bot/avatar?email=${currentUser.email}`, {
                            avatar: fileData,
                        })
                        console.log(data);
                        setErrorText({type: data.type, msg: `${data.message}`})
                        setAlert(' show showAlert');
                        if(data.error === 200) setImage(fileData);
                    }
                );
            }catch (error){
                console.log(error);
                setErrorText({type: "danger", msg: `Error: There was an unexpected error`})
                setAlert(' show showAlert');
                console.log(error);
            }   
        }else{
            setErrorText({type: "danger", msg: `Error: You must set a bot token to edit its details`})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }


    const getPaymentHistory = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/payment/history/${currentUser.email}`);
        if(data){
            setPayments(data)
        }else{
            setPayments([
                {
                    email: currentUser.email
                }
            ]);
        }
        const sub = await axios.get(`${process.env.REACT_APP_API_URL}/subscription/current?customer=${currentUser.email}`);
        if(sub.data){
            setSubscription(sub.data);
        }else{
            setSubscription({
                customerEmail: currentUser.email
            });
        }
        const user = await axios.get(`${process.env.REACT_APP_API_URL}/discord/user?email=${currentUser.email}`);
        setBot(user.data);
        
    }
    const handleBotNameChange = (e) => {
        handleSubscription(e);
        if(bot.id !== "871038939560050739"){
            setBotName(e.target.value);
        }else{
            setErrorText({type: "danger", msg: `Error: You must set a bot token to edit its details`})
            setAlert(' show showAlert');
        }
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleBotNameSubmit = async () => {
        
        if(bot.id !== "871038939560050739"){
            try {
                setLoading(true);
                const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/discord/update/bot/username?email=${currentUser.email}`, {
                    username: botName
                });
                setErrorText({type: data.type, msg: `${data.message}`})
                setAlert(' show showAlert');
            } catch (error) {
                setErrorText({type: "danger", msg: `Error: There was an unexpected error`})
                setAlert(' show showAlert');
                console.log(error);
            }
        }else{
            setErrorText({type: "danger", msg: `Error: You must set a bot token to edit its details`})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setBotName();
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleToken = (e) => {
        if(bot.id !== "871038939560050739"){
            setBotToken(e.target.value);
        }else{
            setErrorText({type: "danger", msg: `Error: You must set a bot token to edit its details`})
            setAlert(' show showAlert');
        }
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleBotTokenSubmit = async () => {
        try {
            setLoading(true);
            const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/subscription/token?email=${currentUser.email}`, {
                token: botToken
            });
            setErrorText({type: data.type, msg: `${data.message}`})
            setAlert(' show showAlert');
        } catch (error) {
            setErrorText({type: "danger", msg: `Error: There was an unexpected error`})
            setAlert(' show showAlert');
            console.log(error);
        }
        setLoading(false);
        setBotToken();
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    useEffect(() => {
        if(window.localStorage.getItem("token") === null) window.location.href = `${process.env.REACT_APP_API_URL}/discord/login`;
        getPaymentHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, loading])
    return (
        subscription && payments && currentUser && bot && subscriptionUser ? <>
            {
                errorText && <div class={`alert${errorText ? (errorText.type === 'warning' ? '' : errorText.type === 'success' ? ' success' : ' danger') : ''}${alert}`}>
                    <span class={`fas fa-${errorText.type === 'warning' ? 'info' : errorText.type === 'success' ? 'check' : 'exclamation'}-circle`}></span>
                    <span class="msg">{errorText.type === "warning" ? "Warning: " : errorText.type === "success" ? "Success: " : "Error: "}{errorText.msg}</span>
                    <div class="close-btn" onClick={(event) => {setAlert(' hide')}}>
                        <span class="fas fa-times"></span>
                    </div>
                </div>
            }
            <div className={`save-modal${botName||botToken?' show':' hide'}`}>
                <div className="save-container">
                    <p>You have unsaved changes</p>
                    <div className="popup-buttons-container">
                        <button className="reset" onClick={(e) => setBotName()}>Reset</button>
                        <button className="save" onClick={(e) => {if(botName) handleBotNameSubmit(); if(botToken) handleBotTokenSubmit();}}>Save Changes</button>
                    </div>
                </div>
            </div>
            <div className={`sidebar-modal${modal?' active':''}`} onClick={handleClose}>
                <div className="sidebar-modal-box">
                    <i class='bx bxs-crown'></i>
                    <h1>Join Premium</h1>
                    <p>Upgrade to AlertBot Premium (from $8/month) to unlock this feature</p>
                    <a href="/premium">Upgrade</a>
                </div>
            </div>
            <div className="account-container">
                <div className="update-bot-container">
                    <div className="bot-avatar-container">
                        <input type="file" accept="image/png, image/gif, image/jpeg" id="file" onChange={fileSelectedHandler}/>
                        <label htmlFor="file">
                            <img src={newImage ? newImage : `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp`} alt="avatar" />
                        </label>
                    </div>
                    <div className="bot-text-container">
                        <span>Username</span>
                        <input type="text" className="bot-name-input" placeholder={bot.username} onChange={(e) => handleBotNameChange(e)} value={botName ? botName : ''} onClick={e => handleSubscription(e)}/>
                        <span>Activity</span>
                        <div className="bot-presence-container">
                            <select name="presence" className="presence-select" onClick={e => handleSubscription(e)}>
                                <option value="playing">Playing</option>
                                <option value="watching">Watching</option>
                            </select>
                            <input type="text" className="presence-input" placeholder="" onClick={e => handleSubscription(e)}/>
                        </div>
                    </div>
                </div>
                <div className="bot-token">
                    <span>Bot Token</span>
                    <div>
                        <input type="text" placeholder={subscriptionUser.level === "premium" ? subscriptionUser.token : ''} onChange={handleToken} onClick={e => handleSubscription(e)} value={botToken}/>
                        <a href={bot?`https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=8`:''}>Invite</a>
                    </div>
                </div>
                <div className="active-subscriptions">
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <td>Subscription</td>
                                    <td>Period</td>
                                    <td>Price</td>
                                    <td>Renews</td>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptionUser.level === "premium" ? <tr>
                                    <td>Alert Bot Premium</td>
                                    <td id="cap">{`${subscription.interval}ly`}</td>
                                    <td id="cap">${subscription.price/100}/{subscription.interval}</td>
                                    <td>{format(subscription.expires, 'dd/MM/yyyy')}</td>
                                </tr> : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
                <form method="POST" action={`http://localhost:50451/stripe/create-customer-portal-session?customer=${subscription.customerId}`} className="sub-form">
                    <button type="submit" className="manage-subscription">Manage Subscription</button>
                </form>
                <h1>Billing History</h1>
                <div className="past-payments">
                    <div className="history">
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <td>Description</td>
                                        <td>Date</td>
                                        <td>Amount</td>
                                        <td>Payement Method</td>
                                        <td>Receipt</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        payments ? payments.map(payment => (
                                            <tr>
                                                <td>Alert Bot Premium</td>
                                                <td>{format(payment.date, 'dd/MM/yyyy')}</td>
                                                <td>${payment.price/100}</td>
                                                <td id="cap">{payment.paymentMethod}</td>
                                                <td><a href={payment.receipt} target="_blank" rel="noreferrer"><i class='bx bx-receipt' ></i></a></td>
                                            </tr>
                                        )) : ''
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> 
        </> : <AccountLoading />
    );
};

export default Account;