const mongoose = require('mongoose')
const subscriptionSchema = mongoose.Schema({
    subscriptionId: String,
    customerId: String,
    customerEmail: String,
    priceId: String,
    price: Number,
    creation: Number,
    expires: Number,
    invoiceUrl: String,
    interval: String,
    level: String, 
    token: String,
})
module.exports = mongoose.model('subscription', subscriptionSchema)