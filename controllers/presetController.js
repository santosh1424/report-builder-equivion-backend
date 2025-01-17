const Preset = require('../models/preset');

exports.createPreset = async (req, res) => {
  try {
    const { name, structure } = req.body;
    const preset = new Preset({ name, structure });
    await preset.save();
    res.status(201).json({ message: 'Preset created successfully', preset });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPresetsList = async (req, res) => {
  try {
    const presets = await Preset.find({}, '_id name'   ); 
    res.json(presets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPreset = async (req, res) => {
  try {
    const preset = await Preset.findById(req.params.id);
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }
    res.json(preset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePreset = async (req, res) => {
  try {
    const { structure, name } = req.body;
    const preset = await Preset.findByIdAndUpdate(
      req.params.id,
      { structure, name },
      { new: true, runValidators: true }
    );
    
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json({ 
      message: 'Preset updated successfully', 
      preset 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePreset = async (req, res) => {
  try {
    const preset = await Preset.findByIdAndDelete(req.params.id);
    
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json({ 
      message: 'Preset deleted successfully',
      preset 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 