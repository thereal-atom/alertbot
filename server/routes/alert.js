const express = require("express")
const router = express.Router();

const controller = require("../controllers/alert");

router.post('/send', controller.sendAlert);
router.put('/channel/new', controller.addChannel);
router.delete('/channel/delete', controller.deleteChannel);
router.get('/channels/get', controller.getChannels);

module.exports = router;