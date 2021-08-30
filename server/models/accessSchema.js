const mongoose = require('mongoose')
const accessSchema = mongoose.Schema({
    id: String,
})
module.exports = mongoose.model('access', accessSchema)