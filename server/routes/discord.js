const express = require("express")
const router = express.Router();

const controller = require("../controllers/discord");

router.get('/login', controller.loginDiscord);
router.delete('/logout', controller.logoutDiscord);
router.get('/callback', controller.callbackDiscord);
router.get('/channels', controller.getChannels);
router.get('/user', controller.getUser);
router.patch('/update/bot/avatar', controller.updateBotAvatar);
router.patch('/update/bot/username', controller.updateBotUsername);

module.exports = router;