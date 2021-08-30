const stripe = require("stripe")(process.env.STRIPE_SECRET);
const portalSession = async (req, res) => {
    const session = await stripe.billingPortal.sessions.create({
        customer: req.query.customer,
        return_url: `${process.env.CLIENT_URL}/account`,
    });
    if(req.query.customer){
        res.redirect(session.url);
    }else{
        res.sendStatus(401);
    }
}
module.exports = {
    portalSession
}




