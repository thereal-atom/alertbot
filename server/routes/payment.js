const express = require("express")
const router = express.Router();

const controller = require("../controllers/payment");

router.get('/history/:customer', controller.requestPayments);
router.post('/succeeded', controller.paymentIntentSucceeded);

module.exports = router;