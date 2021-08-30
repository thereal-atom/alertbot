const paymentSchema = require('../models/paymentSchema');
const axios = require("axios");
const subscriptionSchema = require('../models/subscritpionSchema');
const requestPayments = async (req, res) => {
    try {
        const result = await paymentSchema.find({customerEmail: req.params.customer});
        res.status(200).send(result);
    } catch (error) {
        res.sendStatus(500);
    }

}

const paymentIntentSucceeded = async (req, res) => {
    //Destructuring
    console.log("Payment")
    try{
        const { id, status, created, charges, metadata, customer, amount } = req.body.data.object;
        if(id && status && created && charges && metadata && customer && amount){
            const { billing_details, payment_method_details, receipt_url, description, price } = charges.data[0];
            //See if they have any exisiting payments to determin the reference id
            const result = await paymentSchema.findOne({customerEmail: billing_details.email});
            if(billing_details && payment_method_details && receipt_url && description){
                if(status === 'succeeded'){
                    try{
                        //All this is for the payment schemas
                        //Payment object
                        const payment = {
                            customerId: customer,
                            customerEmail: billing_details.email,
                            paymentReferenceId: result?result.paymentReferenceId+1:1,
                            priceId: id,
                            price: amount, 
                            date: created*1000,
                            paymentMethod: `${payment_method_details.card.brand}`,
                            receipt: receipt_url,
                            level: "premium",
                        }
                        await axios.post(`https://discord.com/api/v9/channels/879080820948762694/messages`, {
                            "embeds": [{
                                "author": {
                                    name: `Payment by ${payment.customerEmail}`
                                },
                                "title": `${payment.level} for $${amount/100}`,
                                "description": `Payment Ref: ${payment.paymentReferenceId}\nDate: ${payment.date}\nMethod: ${payment.paymentMethod}`,
                                "footer": { 
                                    text: `${payment.receipt}`
                                },
                                
                            }]
                            },{
                            headers: {
                                Authorization: "Bot ODcxMDM4OTM5NTYwMDUwNzM5.YQVgOg.Li-JYe9QyytxzQjgGmMCtgn1MyQ",
                                "Content-Type": "application/json"
                            }
                        })

                        new paymentSchema(payment).save().then(res.sendStatus(201)).catch((error) => {console.log(error);res.sendStatus(500)});
                        //Here i will check if there is vip or premium metadata to determine if this is also a lifetime subscription
                        if(metadata.lifetime){
                            const lifetimeSubscription = {
                                subscriptionId: id,
                                customerId: customer,
                                customerEmail: billing_details.email,
                                price: amount,
                                creation: created,
                                expires: 33186569646000,
                                invoiceUrl: receipt_url,
                                inverval: 'lifetime',
                                level: metadata.level,
                            }
                            new subscriptionSchema(lifetimeSubscription).save().then(res.sendStatus(201)).catch((error) => {console.log(error);res.sendStatus(500)});
                        }
                        console.log("Payment success")
                    } catch(error) {
                        console.log(error);
                        res.sendStatus(500);//Server error
                    }
                }else{ res.sendStatus(403);}//Status isnt succeeded - unautorized
            }else{ res.sendStatus(400);}//Missing data from charges.data[0] - bad req
        }else{ res.sendStatus(400);}//Missing data from body - bad req
    }catch(error){
        console.log(error);
        res.sendStatus(500);//Server error
    }
}

module.exports = {
    requestPayments,
    paymentIntentSucceeded,
}