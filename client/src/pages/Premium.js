import React, { useState } from 'react';
import './Styles/Premium.css';
import { loadStripe } from '@stripe/stripe-js'; 

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY)
//process.env.REACT_APP_PREMIUM_MONTHLY

const Premium = ({currentUser}) => {
    const [stripeError, setStripeError] = useState();
    const [loading, setLoading] = useState();
    const [modal, setModal] = useState(false);
    
    const handleSusbscription = async (priceId, mode) => {
        if(window.localStorage.getItem("token") === null) return window.location.href = `${process.env.REACT_APP_API_URL}/discord/login`;
        setLoading(true);

        const stripe = await stripePromise;

        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                {
                    price: priceId,
                    quantity: 1,
                }
            ],
            mode,
            cancelUrl: `${process.env.REACT_APP_HOME_URL}/premium`,
            successUrl: `${process.env.REACT_APP_HOME_URL}/account`,
            customerEmail: 'oscarfal2006@gmail.com'
        });

        if(error) {
            setLoading(false);
            setStripeError(error);
            console.log(stripeError);
        }
    }

    return (
        <>
            <div className={`premium-modal${modal?' active':''}`} onClick={(event) => setModal(event.target.className === "premium-modal active" ? false : true)}>
                <div className={`premium-modal-box`}>
                    <div className="monthly-box">
                        <h1>Premium Monthly</h1>
                        <p onClick={(event) => handleSusbscription(process.env.REACT_APP_PREMIUM_MONTHLY, "subscription")}>$20/month</p>
                        <span>$20 billed monthly</span>
                    </div>
                    <div className="monthly-box">
                        <h1>Premium Yearly</h1>
                        <p onClick={(event) => handleSusbscription(process.env.REACT_APP_PREMIUM_YEARLY, "subscription")}>$8/month</p>
                        <span><span className="smol">$240</span>$96 billed yearly</span>
                    </div>
                    <div className="monthly-box">
                        <h1>Premium Lifetime</h1>
                        <p onClick={(event) => handleSusbscription(process.env.REACT_APP_PREMIUM_LIFETIME, "payment")}>$199 One time</p>
                        <span>$199 billed once</span>
                    </div>
                </div>
            </div>
            <div className="premium-container">
                <div className="yearly">
                    <div className="prem-content-wrapper">
                        <div className="premium-title">Free</div>
                        <div className="pricing">
                            <div className="price">$0</div>
                            <div className="reccurance">Per month</div>
                        </div>
                        <hr className="divide"/>
                        <div className="premium-features-container">
                            <div className="p"><i className='bx bx-check' ></i> Send alerts to up to three servers</div>
                            <div className="p"><i className='bx bx-check' ></i> Use one premade preset</div>
                            <div className="p"><i className='bx bx-x' ></i> Customize avatar, nickname</div>
                            <div className="p"><i className='bx bx-x' ></i> Customize bot activity</div>
                            <div className="p"><i className='bx bx-x' ></i> Access to future stock bot</div>
                            <div className="p"><i className='bx bx-x' ></i> Customize and create presets</div>
                        </div>
                    </div>
                    <div className="buy-wrapper" id="last">
                        <button className="buy-now" disabled={loading} onClick={(e) => window.location.href = process.env.REACT_APP_INVITE}>Invite Now</button>
                        <div className="smol"> $0 billed monthly</div>
                    </div>
                </div>
                <div className="vip">
                    <div className="prem-content-wrapper">
                        <div className="premium-title">Premium Monthly</div>
                        <div className="pricing">
                            <div className="price">$20</div>
                            <div className="reccurance">Per month</div>
                        </div>
                        <hr className="divide"/>
                        <div className="premium-features-container">
                            <div className="p"><i className='bx bx-check' ></i> Send alerts to unlimited servers at once</div>
                            <div className="p"><i className='bx bx-check' ></i> Create, edit and use unlimited presets</div>
                            <div className="p"><i className='bx bx-check' ></i> Customise avatar and nickname</div>
                            <div className="p"><i className='bx bx-check' ></i> Customise bot activity</div>
                            <div className="p"><i className='bx bx-check' ></i> Access to future features</div>
                            <div className="p"><i className='bx bx-check' ></i> Access to future stock bot</div>
                            <a className="p" href="https://docs.alert-bot.xyz/premium"><i className='bx bx-info-circle' ></i></a>
                        </div>
                    </div>
                    <div className="buy-wrapper" id="middle">
                        <button className="buy-now" id="middle-button"disabled={loading} onClick={(event) => setModal({active: true, type: "vip"})}>Buy now</button>
                        <div className="smol" >$20 billed monthly</div>
                    </div>
                </div>
                <div className="premium">
                    <div className="prem-content-wrapper">
                        <div className="premium-title">Premium Yearly</div>
                        <div className="pricing">
                            <div className="price">$8</div>
                            <div className="reccurance">Per month</div>
                        </div>
                        <hr className="divide"/>
                        <div className="premium-features-container">
                            <div className="p"><i className='bx bx-check' ></i> 60% cheaper than monthly</div>
                        </div>
                    </div>
                    <div className="buy-wrapper" id="first">
                        <button className="buy-now"disabled={loading} onClick={(event) => setModal({active: true, type: "premium"})}>Buy now</button>
                        <div className="smol"> <span>$240</span> $96 billed monthly</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Premium
