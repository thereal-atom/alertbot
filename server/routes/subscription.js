const express = require("express")
const router = express.Router();

const controller = require("../controllers/subscription");

// router.post('/created', controller.subscriptionCreated);
router.get('/current', controller.requestSubscriptions);
router.post('/payment', controller.subscriptionPayment);
router.put('/token', controller.setToken);

module.exports = router;