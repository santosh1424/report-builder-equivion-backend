const express = require('express');
const router = express.Router();
const presetController = require('../controllers/presetController');

router.post('/', presetController.createPreset);
router.get('/', presetController.getPresetsList);
router.get('/:id', presetController.getPreset);
router.put('/:id', presetController.updatePreset);
router.delete('/:id', presetController.deletePreset);

module.exports = router; 