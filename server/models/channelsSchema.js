const mongoose = require('mongoose')
const channelsSchema = mongoose.Schema({
    email: String,
    tag: String, 
    channels: [Object],
})
module.exports = mongoose.model('channels', channelsSchema)