const express = require("express")
const router = express.Router();

const controller = require("../controllers/preset");
//Get
router.get('/get', controller.getPresets);
router.get('/all', controller.allPresets);
//Preset
router.post('/new', controller.newPreset);
router.patch('/update', controller.updatePreset);
//Attributes
router.patch('/update/color', controller.updateColor)
router.patch('/update/footer', controller.updateFooter);
router.patch('/update/author', controller.updateAuthor);
router.patch('/update/description', controller.updateDesc);
router.patch('/update/title', controller.updateTitle);
//Paramaters
router.put('/paramaters/new', controller.newParamater);
router.patch('/paramaters/update', controller.updateParamater)
router.delete('/paramaters/delete', controller.deleteParamater);
module.exports = router;