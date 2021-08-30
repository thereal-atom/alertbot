const express = require("express");
const bodyParser = require('body-parser') 
const cors = require('cors') 
const add = require('date-fns/add');

const db = require('./mongo.js')
const subscriptionSchema = require("./models/subscritpionSchema");
const presetSchema = require("./models/presetSchema");
const channelsSchema = require("./models/channelsSchema");

const connectToMongoDB = async () => {await db().then(async (mongoose) => {try{console.log('DB - Server: Connected')}finally{mongoose.connection.close}})}//Connect to the database
connectToMongoDB() 

const subscriptionRoute = require("./routes/subscription");
const paymentRoute = require("./routes/payment");
const authRoute = require('./routes/discord'); 
const alertRoute = require('./routes/alert');
const presetRoute = require('./routes/preset') ;
const testRoute = require('./routes/test');
const stripeRoute= require('./routes/stripe');
const accessRoute = require('./routes/access');

const app = express()

app.use(cors())
app.use(bodyParser.json({limit: '200mb'}));

app.use('/subscription', subscriptionRoute)
app.use('/payment', paymentRoute)
app.use('/discord', authRoute)
app.use('/alert', alertRoute)
app.use('/presets', presetRoute);
app.use('/test', testRoute)
app.use('/stripe', stripeRoute)
app.use('/access', accessRoute)

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.listen(process.env.PORT || 50451, () => {
    console.log(`Listening on port http://localhost:${process.env.PORT}`);
    setInterval(async () => {
        const subscription = await subscriptionSchema.find({});
        subscription.forEach(async sub => {
            if(add(sub.expires, {days: 1}) < new Date().getTime() && sub.level !== "free"){
                const { customerEmail, subscriptionId } = sub
                await subscriptionSchema.updateOne({customerEmail, subscriptionId}, {
                    level: "free"
                })
            }
        }) 
    }, 2 * 60 * 60 * 1000);
})