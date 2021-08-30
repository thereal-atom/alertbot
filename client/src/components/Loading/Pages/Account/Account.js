import React from 'react';
import './Account.css';

const AccountLoading = () => {
    return (
        <>
            <div className="account-container">
                <div className="update-bot-container">
                    <div className="bot-avatar-container">
                        <input type="file" accept="image/png, image/gif, image/jpeg" id="file"/>
                        <label htmlFor="file"></label>
                    </div>
                    <div className="bot-text-container">
                        <span>Username</span>
                        <input type="text" className="bot-name-input"/>
                        <span>Activity</span>
                        <div className="bot-presence-container">
                            <select name="presence" className="presence-select">
                            </select>
                            <input type="text" className="presence-input" placeholder=""/>
                        </div>
                    </div>
                </div>
                <div className="active-subscriptions">
                    <div className="load-table">
                        <table>
                            <thead>
                                <tr>
                                    <td>Subscription</td>
                                    <td>Period</td>
                                    <td>Price</td>
                                    <td>Renews</td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="blank-container">
                        <div className="blank" id="sub"></div>
                        <div className="blank" id="period"></div>
                        <div className="blank" id="price"></div>
                        <div className="blank" id="renews"></div>
                    </div>
                </div>
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
                            </table>
                            <div className="blank-container">
                                <div className="blank" id="desc">a</div>
                                <div className="blank" id="date">a</div>
                                <div className="blank" id="amount">a</div>
                                <div className="blank" id="pay">a</div>
                                <div className="blank" id="rec">a</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    );
};

export default AccountLoading;