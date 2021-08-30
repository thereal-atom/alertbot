const mongoose = require('mongoose')
const analyticsSchema = mongoose.Schema({
    alerts: Number,
    presets: Number, 
    accounts: Number,
    servers: Number,
    users: Number,
})
module.exports = mongoose.model('analytics', analyticsSchema)