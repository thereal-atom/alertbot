const subscriptionSchema = require('../models/subscritpionSchema');
const analyticsSchema = require('../models/analyticsSchema');
const presetSchema = require("../models/presetSchema");
const axios = require('axios');
const requestSubscriptions = async (req, res) => {
    try {
        const result = await subscriptionSchema.findOne({ customerEmail: req.query.customer })
        res.status(200).send(result);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
}
const createPresets = async email => {
    const footer = "AlertBot";
    const description = `[Website](${process.env.CLIENT_URL})`
    const entry = {
        name: "entry",
        paramaters: [
            {
                name: "Coin",
                withTitle: true,
                titleBold: true,
            },
            {
                name: "Entry",
                withTitle: true,
                titleBold: true,
            },
            {
                name: "Leverage",
                withTitle: true,
                titleBold: true,
            },
            {
                name: "Stop Loss",
                withTitle: true,
                titleBold: true,
            },
            {
                name: "Take Profit",
                withTitle: true,
                titleBold: true,
            },
            {
                name: "Comments",
                withTitle: true,
                titleBold: true,
            },
        ],
        email,
        color: "#3bff70",
        description,
        footer,
    }
    const exit = {
        name: "exit",
        paramaters: [
            {
                name: "Coin",
                withTitle: true,
                titleBold: true,
            },
            {
                name: "Exit",
                withTitle: true,
                titleBold: true,
            },
            {
                name: "Profit",
                withTitle: true,
                titleBold: true,
            },
            {
                name: "Comment",
                withTitle: true,
                titleBold: true,
            },
        ],
        email,
        color: "#ff3b3b",
        description,
        footer,
    }
    const comment = {
        name: "comment",
        paramaters: [
            {
                name: "Comment",
                withTitle: true,
                titleBold: true,
            }
        ],
        email,
        color: "#00ffbb",
        description,
        footer,
    }
    let presetsArray = [exit, comment];
    const existing = await presetSchema.findOne({email, name: "entry"});
    if(!existing) presetsArray.push(entry);
    presetsArray.forEach(async preset => await new presetSchema(preset).save());
}
const subscriptionPayment = async (req, res) => {
    console.log("Subscription")
    const { id, status, billing_reason, created, customer, customer_email, hosted_invoice_url, lines } = req.body.data.object;
    try {
        if(id && status && billing_reason && created && customer && customer_email && hosted_invoice_url && lines){
            if(status === 'paid'){
                if(billing_reason === 'subscription_create'){
                    const subscription = {
                        subscriptionId: id,
                        customerId: customer,
                        customerEmail: customer_email,
                        priceId: lines.data[0].plan.id,
                        price: lines.data[0].plan.amount,
                        creation: created*1000,
                        expires: lines.data[0].period.end*1000,
                        invoiceUrl: hosted_invoice_url,
                        interval: lines.data[0].plan.interval,
                        level: "premium",
                    } 
                    try {
                        new subscriptionSchema(subscription).save().then(async ()=> {
                            await axios.post(`https://discord.com/api/v9/channels/879080820948762694/messages`, {
                                "embeds": [{
                                    "author": {
                                        name: `New subscription for ${subscription.customerEmail}`
                                    },
                                    "title": `${subscription.level} for $${subscription.price/100} per ${subscription.interval}`,
                                    "description": `Expires: ${subscription.expires}`,
                                    "footer": { 
                                        text: `${subscription.invoiceUrl}`
                                    },
                                    
                                }]
                                },{
                                headers: {
                                    Authorization: "Bot ODcxMDM4OTM5NTYwMDUwNzM5.YQVgOg.Li-JYe9QyytxzQjgGmMCtgn1MyQ",
                                    "Content-Type": "application/json"
                                }
                            })
                            const result = await analyticsSchema.findOne({})
                            await analyticsSchema.updateOne({}, {
                                accounts: result.accounts + 1,
                            })
                            createPresets(customer_email);
                            console.log(`Subscription created for ${customer_email}`);
                            res.sendStatus(201)//Create subscription
                        }).catch((error) => {console.log(error);res.sendStatus(500)});
                    } catch (error) {
                        console.log(error);
                        res.sendStatus(500);
                    }
                }else if(billing_reason === 'subscription_cycle'){
                    console.log('new payment')
                    await subscriptionSchema.updateOne({customerEmail: customer_email}, {
                        creation: created*1000,
                        expires: lines.data[0].period.end*1000,
                        invoiceUrl: hosted_invoice_url,
                    })
                    res.sendStatus(200);//Update subscription
                }else if(billing_reason){
                    res.sendStatus(501);//Billing reason not found - not implemented
                }else{
                    res.sendStatus(500);//Server error
                }
            }else{res.sendStatus(403);}//Status not payed - unauthorized
        }else{res.sendStatus(400);}//Missing data from body - bad req
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
const setToken = async (req, res) => {
    const { email } = req.query;
    const { token } = req.body;
    if(token && email){
        try {
            await subscriptionSchema.updateOne({customerEmail: email}, {
                token
            });
        } catch (error) {
            res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"});
        }
    }else{
        res.status(200).send({error: 400, message: "You did not provide a token", type: "danger"});
    }
    res.status(200).send({error: 200, message: "Token succesfully updated", type: "success"});
}
module.exports = {
    requestSubscriptions,
    subscriptionPayment,
    setToken,
}