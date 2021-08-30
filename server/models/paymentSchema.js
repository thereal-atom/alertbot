const mongoose = require('mongoose')
const paymentSchema = mongoose.Schema({
    customerId: String,
    customerEmail: String,
    paymentReferenceId: Number,
    priceId: String,
    price: Number,
    date: Number,
    paymentMethod: String,
    receipt: String,
    level: String,
})
module.exports = mongoose.model('payment', paymentSchema)