const express = require("express")
const router = express.Router();

const controller = require("../controllers/stripe");

router.post('/create-customer-portal-session', controller.portalSession);

module.exports = router;