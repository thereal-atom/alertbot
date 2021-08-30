const mongoose = require('mongoose')
const presetSchema = mongoose.Schema({
    email: String,
    name: String,
    color: String,
    author: String,
    title: String,
    paramaters: [Object],
    description: String,
    footer: String,
    
})
module.exports = mongoose.model('presets', presetSchema);