const express = require("express")
const router = express.Router();

const controller = require("../controllers/access");

router.patch('/add', controller.addUser);
router.get('/users', controller.getUsers);

module.exports = router;